# Deploy janbmedina.com on Cloudflare Pages

## Source of truth

- **Production repo:** this repository (`AhjinGuild12/personal-OS`)
- **Do not** deploy `neobrutalist-personal-os-astro` as production

## Stack

- Astro 5 static build → `dist/`
- React Personal OS island at `/os`
- Cloudflare **Workers static assets** worker name: `personal-os`
- Preview URL pattern: `https://personal-os.<subdomain>.workers.dev`

## Wrangler notes

`wrangler.toml` must use:

- `directory = "./dist/"` (trailing slash)
- `html_handling = "auto-trailing-slash"` so `/os/` and `/blog/` resolve
- Current OAuth token needs `workers:write` (Pages `pages:write` was missing; Workers path works)

If you prefer Pages UI later, re-auth with `npx wrangler login` (includes `pages:write`) and switch deploy scripts.

## One-time setup

1. Ensure Wrangler is logged in: `npx wrangler whoami`
2. Deploy once: `npm run deploy:cf` (creates/updates the Worker)
3. In Cloudflare dashboard → Workers → `personal-os` → Settings → Variables and Secrets:
   - For **build-time** Gemini injection you still need the key present when running `npm run build` locally/CI (`GEMINI_API_KEY` env). Runtime Worker secrets do not re-bake Vite `define`.
   - Recommended long-term: CI build with `GEMINI_API_KEY` secret, then `wrangler deploy`
4. Attach custom domains after smoke passes:
   - Workers → `personal-os` → Settings → Domains & Routes (or Custom Domains)
   - Add `janbmedina.com` and `www.janbmedina.com`
5. Match live redirect preference: **www canonical** (apex → www), HTTPS only

## Commands

```bash
npm install
npm run build
npm run deploy:cf          # build + wrangler deploy
npm run smoke:cf -- https://personal-os.<account>.workers.dev
```

## Cutover checklist

1. Smoke preview URL (must show `server: cloudflare`, not Vercel)
2. Lower DNS TTL if needed
3. Attach custom domains on the Worker; ensure DNS is **proxied** (orange cloud)
4. Re-run smoke against `https://www.janbmedina.com` and apex
5. Keep Vercel domain binding ≥48h for rollback
6. See `cloudflare-migration-baseline.md` for prior DNS values

## Rollback

Restore DNS from `docs/deploy/cloudflare-migration-baseline.md`.
