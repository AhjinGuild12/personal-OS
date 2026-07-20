#!/usr/bin/env node
/**
 * Production cutover helper: delete Vercel DNS conflicts, then attach
 * Worker custom domains via wrangler deploy.
 *
 * Requires: CLOUDFLARE_API_TOKEN with Zone.DNS Edit on janbmedina.com
 * Optional: CLOUDFLARE_ACCOUNT_ID (default known account)
 *
 * Usage:
 *   export CLOUDFLARE_API_TOKEN=...
 *   node scripts/cutover-custom-domains.mjs
 */
import { execSync } from "node:child_process";
import { writeFileSync, chmodSync } from "node:fs";

const ZONE_NAME = "janbmedina.com";
const HOSTS = ["janbmedina.com", "www.janbmedina.com"];
const ACCOUNT_ID =
  process.env.CLOUDFLARE_ACCOUNT_ID || "dedd2b6384c93b198bc12ebda9eddd92";
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!TOKEN) {
  console.error(
    "Missing CLOUDFLARE_API_TOKEN.\n" +
      "Create a token at https://dash.cloudflare.com/profile/api-tokens\n" +
      "Permissions: Zone → DNS → Edit (zone Resources: janbmedina.com)\n" +
      "Then: export CLOUDFLARE_API_TOKEN=... && node scripts/cutover-custom-domains.mjs"
  );
  process.exit(1);
}

async function cf(method, path, body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  return { status: res.status, json };
}

const zones = await cf("GET", `/zones?name=${ZONE_NAME}`);
if (!zones.json.success || !zones.json.result?.[0]) {
  console.error("Zone not found or token cannot read zones:", zones.json.errors);
  process.exit(2);
}
const zoneId = zones.json.result[0].id;
console.log("Zone", ZONE_NAME, zoneId);

const dns = await cf("GET", `/zones/${zoneId}/dns_records?per_page=100`);
if (!dns.json.success) {
  console.error("Cannot list DNS (need Zone.DNS Edit):", dns.json.errors);
  process.exit(3);
}

const hostSet = new Set(HOSTS);
const victims = (dns.json.result || []).filter(
  (r) =>
    hostSet.has(r.name) &&
    (r.type === "A" || r.type === "AAAA" || r.type === "CNAME")
);

console.log(
  "Deleting conflicting records:",
  victims.map((r) => `${r.type} ${r.name} → ${r.content}`).join("; ") || "(none)"
);

for (const r of victims) {
  const del = await cf("DELETE", `/zones/${zoneId}/dns_records/${r.id}`);
  if (!del.json.success) {
    console.error("Failed to delete", r.name, del.json.errors);
    process.exit(4);
  }
  console.log("Deleted", r.type, r.name);
}

console.log("Deploying Worker with custom domains…");
execSync("npx wrangler deploy", { stdio: "inherit" });

// Smoke
const base = "https://www.janbmedina.com";
console.log("Waiting 5s for DNS/SSL…");
await new Promise((r) => setTimeout(r, 5000));
execSync(`node scripts/smoke-cloudflare-preview.mjs ${base}`, {
  stdio: "inherit",
});

writeFileSync(
  "docs/deploy/cutover-timestamp.txt",
  `cutover_completed_at=${new Date().toISOString()}\nzone=${zoneId}\naccount=${ACCOUNT_ID}\n`
);
chmodSync("docs/deploy/cutover-timestamp.txt", 0o644);
console.log("Cutover script finished.");
