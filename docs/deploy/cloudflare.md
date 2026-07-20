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

**Blocker:** existing Vercel A/CNAME records on the zone must be deleted before attach (CF error 100117). Wrangler OAuth can deploy Workers but **cannot edit DNS** (no Zone.DNS scope).

### Automated cutover (preferred)

1. Create API token: [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)  
   - Permissions: **Zone → DNS → Edit**  
   - Zone Resources: **Include → Specific zone → janbmedina.com**
2. Run:

```bash
export CLOUDFLARE_API_TOKEN=...   # paste token
node scripts/cutover-custom-domains.mjs
```

This deletes conflicting apex/www A|AAAA|CNAME records, runs `wrangler deploy`, then smokes `https://www.janbmedina.com`.

### Manual cutover

1. Smoke preview: `npm run smoke:cf -- https://personal-os.cloudfare-math033.workers.dev`
2. In Cloudflare DNS for `janbmedina.com`, **delete**:
   - apex `A` → `216.198.79.1` (Vercel)
   - `www` `CNAME` → `*.vercel-dns-017.com`
3. `npm run deploy:cf` (creates custom domain DNS + SSL)
4. Add Redirect Rule: apex `janbmedina.com` → `https://www.janbmedina.com` (301) if apex is not already redirected
5. `npm run smoke:cf -- https://www.janbmedina.com`
6. Keep Vercel project ≥48h for rollback (baseline file)

## Rollback

Restore DNS from `docs/deploy/cloudflare-migration-baseline.md`.

## Rollback

Restore DNS from `docs/deploy/cloudflare-migration-baseline.md`.
