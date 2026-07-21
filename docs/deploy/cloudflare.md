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

Worker config already includes custom domains in `wrangler.toml`:

```toml
[[routes]]
pattern = "janbmedina.com"
custom_domain = true

[[routes]]
pattern = "www.janbmedina.com"
custom_domain = true
```

### Cutover (completed 2026-07-21)

1. Deleted Vercel A/CNAME from Cloudflare DNS (manual)
2. `npx wrangler deploy` attached custom domains for apex + www
3. Production verified: `server: cloudflare` via authoritative DNS (`dig @1.1.1.1`)

### Post-cutover cleanup (after ≥24–48h)

1. Vercel → project → Domains → remove `janbmedina.com` / `www` if still listed
2. Keep the Vercel project until you no longer need emergency rollback
3. Emergency rollback: restore records from `cloudflare-migration-baseline.md`

## Production status

- **Worker:** `personal-os`
- **Domains:** `janbmedina.com`, `www.janbmedina.com` (custom domains)
- **Preview:** `https://personal-os.cloudfare-math033.workers.dev`
- If your browser still hits Vercel, flush DNS / try `dig @1.1.1.1 www.janbmedina.com A`

## Rollback

Restore DNS from `docs/deploy/cloudflare-migration-baseline.md`.