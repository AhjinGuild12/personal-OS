#!/usr/bin/env node
/**
 * Smoke-check a Cloudflare (or any) preview/production base URL.
 * Usage: node scripts/smoke-cloudflare-preview.mjs https://example.pages.dev
 */
const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) {
  console.error("Usage: node scripts/smoke-cloudflare-preview.mjs <base-url>");
  process.exit(1);
}

const paths = [
  "/",
  "/os",
  "/blog",
  "/i-build",
  "/about",
  "/projects",
  "/contact",
  "/robots.txt",
];

const failures = [];

for (const path of paths) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const server = res.headers.get("server") || "";
    const ok = res.status >= 200 && res.status < 400;
    const line = `${ok ? "OK" : "FAIL"} ${res.status} ${path} server=${server}`;
    console.log(line);
    if (!ok) failures.push(line);
    if (/vercel/i.test(server)) {
      failures.push(`UNEXPECTED_VERCEL ${path} server=${server}`);
    }
  } catch (err) {
    const line = `ERROR ${path} ${err.message}`;
    console.error(line);
    failures.push(line);
  }
}

// Spot-check OS island shell loads
try {
  const osRes = await fetch(`${base}/os`);
  const html = await osRes.text();
  if (!html.includes("astro-island") && !html.includes("/_astro/")) {
    failures.push("OS_SHELL missing astro-island or /_astro/ assets");
  } else {
    console.log("OK /os shell includes Astro island markers");
  }
} catch (err) {
  failures.push(`OS_SHELL ${err.message}`);
}

if (failures.length) {
  console.error("\nSmoke failed:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("\nSmoke passed.");
