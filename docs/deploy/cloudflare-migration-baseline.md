# Cloudflare migration baseline — 2026-07-18

## Source of truth
- Repo: `AhjinGuild12/personal-OS` (this repository)
- Live Vercel alias: `https://mypersonalos.vercel.app` (content matches janbmedina.com)
- Do **not** deploy `AhjinGuild12/neobrutalist-personal-os-astro` as production (stale relative to live)

## Pre-cutover DNS (rollback target)

| Host | Type | Value |
|------|------|-------|
| NS | NS | maya.ns.cloudflare.com, zod.ns.cloudflare.com |
| @ (apex) | A | `216.198.79.1` (Vercel) |
| www | CNAME | `c9982470aad6dc11.vercel-dns-017.com.` |

## Pre-cutover HTTP headers (sample)

```
HTTP/2 200 
accept-ranges: bytes
access-control-allow-origin: *
age: 455
cache-control: public, max-age=0, must-revalidate
content-disposition: inline
content-type: text/html; charset=utf-8
date: Sat, 18 Jul 2026 07:13:41 GMT
etag: "14a9f9390f4d07d925aba5aaa3642524"
last-modified: Sat, 18 Jul 2026 07:06:06 GMT
server: Vercel
strict-transport-security: max-age=63072000
x-vercel-cache: HIT
x-vercel-id: syd1::q2mn4-1784358821763-d54893c334a9
content-length: 21974

```

## Rollback procedure

1. In Cloudflare DNS for janbmedina.com, restore apex A to `216.198.79.1`.
2. Restore www CNAME to `c9982470aad6dc11.vercel-dns-017.com.`.
3. Verify: `curl -sI https://www.janbmedina.com | grep -i server` shows `Vercel`.
4. Keep Vercel project domain binding until post-soak teardown.
