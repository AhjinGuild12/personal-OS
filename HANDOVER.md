# Date

2026-03-11

# Scope

Migrate the live `personal-OS` repo from the old Vite SPA shell to an Astro website while preserving the React Personal OS at `/os`. This pass is local-only; nothing has been deployed yet.

# Changes Implemented

- Added Astro as the site framework in the live repo and updated project config:
  - `package.json`
  - `package-lock.json`
  - `astro.config.mjs`
  - `tsconfig.json`
  - `.gitignore`
- Added a real Astro site structure with public routes:
  - `src/pages/index.astro`
  - `src/pages/about.astro`
  - `src/pages/projects.astro`
  - `src/pages/blog/index.astro`
  - `src/pages/blog/[slug].astro`
  - `src/pages/contact.astro`
  - `src/pages/rss.xml.ts`
  - `src/pages/os.astro`
- Added the Astro content collection and blog content:
  - `src/content.config.ts`
  - `src/content/blog/*.md`
- Added shared site layout and styling:
  - `src/layouts/BaseLayout.astro`
  - `src/styles/global.css`
- Copied the approved React OS implementation into the Astro app and kept `/os` as the mounted React island:
  - `src/components/react/*`
  - `src/context/ThemeContext.tsx`
  - `src/data/*`
  - `src/hooks/*`
  - `src/types.ts`
  - `src/types/theme.ts`
  - `src/utils/sounds.ts`
- Added site-support files:
  - `public/robots.txt`
  - `public/llms.txt`
  - `scripts/validate-themes-local.mjs`
- Tightened the Astro TypeScript scope to the new `src` app and suppressed inline-script checker noise on the homepage and blog index:
  - `tsconfig.json`
  - `src/pages/index.astro`
  - `src/pages/blog/index.astro`

# Validation

- `npm install`
  - Pass
  - Astro and site dependencies installed in the live repo
- `npm run build`
  - Pass
  - Static routes generated successfully for `/`, `/about`, `/projects`, `/blog`, `/blog/[slug]`, `/contact`, `/os`, and `/rss.xml`
  - Sitemap generated successfully
- `npx astro check`
  - Pass with 0 errors
  - Remaining output is hints only (mostly inline script / deprecated API hints)
- `npm run validate:themes-local`
  - Pass
  - Dev and preview both served `/os`
  - XP default, Neo/XP/Aqua switching, Aqua dock, and taskbar visibility checks all passed
  - Artifacts written to `/var/folders/1v/4wx5rnp57vd34x4ydcsncy2c0000gn/T/theme-validation-artifacts-VLwwCQ`
- Local preview
  - Running at `http://127.0.0.1:4322/`
  - Verified `200 OK` for `/`, `/blog/`, `/blog/why-i-built-a-retro-os/`, and `/os/`

# Current Behavior

- `personal-OS` is now the single local codebase for the public website and the React OS
- `/` is a crawlable terminal-style CV homepage with featured writing and a CTA into `/os`
- `/blog` and `/blog/[slug]` are real static pages with metadata and structured data
- `/about`, `/projects`, and `/contact` are real public pages
- `/os` preserves the React desktop OS with XP default, theme switching, and Aqua dock behavior
- The old root-level Vite app files still exist in the repo but are no longer part of the Astro build path

# Known Issues / Risks

- `npx astro check` still reports hints (not errors) for some inline scripts and deprecated browser APIs; these do not currently block build or preview
- The old legacy Vite files remain in the repo root and may be worth removing in a cleanup pass once the Astro migration is confirmed live
- `npm audit` reports vulnerabilities in the dependency tree; not addressed in this pass
- Untracked local-only state still exists in `.claude/` and should not be committed

# Next Steps

- Review the migrated site locally at:
  - `http://127.0.0.1:4322/`
  - `http://127.0.0.1:4322/blog/`
  - `http://127.0.0.1:4322/blog/why-i-built-a-retro-os/`
  - `http://127.0.0.1:4322/os/`
- If approved, stage only the Astro migration files in `personal-OS`, commit them, and push to trigger Vercel
- After deployment, verify that `janbmedina.com`, `janbmedina.com/blog`, and `janbmedina.com/os` all resolve to the migrated build
- In a later cleanup pass, delete the unused legacy Vite shell files from the repo root
