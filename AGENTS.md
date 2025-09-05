# Repository Guidelines

## Project Structure & Module Organization
- App UI and routes: `app/` (React Router, SSR entry in `app/entry.server.tsx`).
- Domain libs and utils: `app/lib/`, `app/utils/`, components in `app/components/`.
- Content: `contents/` (e.g., `contents/blog/`, `apps.json`, `tags.json`).
- Database: Drizzle schema in `database/`, SQL migrations in `drizzle/`.
- Public assets: `public/`. Build output: `build/`.
- Tests: colocated (e.g., `app/root.test.tsx`) and setup in `test/setup.ts`.
- Config: `vite.config.ts`, `wrangler.jsonc`, `drizzle.config.ts`, `biome.json`, `tsconfig*.json`.

## Build, Test, and Development Commands
- `npm run dev`: Build content and run React Router dev server.
- `npm run build`: Build blog content then app for production.
- `npm run preview`: Serve the built app locally.
- `npm test`: Run Vitest unit tests.
- `npm run check`: Type-check and run Biome (lints/format).
- DB: `npm run db:generate` (generate migrations), `npm run db:migrate` (apply to local D1), `npm run db:migrate-production`.
- Deploy: `npm run deploy` (build and deploy via Cloudflare Wrangler).

## Coding Style & Naming Conventions
- Language: TypeScript (ESM). Indentation: 2 spaces.
- Formatting/Linting: Biome. Run `npm run biome:check` before commits.
- Components: `PascalCase` (files like `MyComponent.tsx`).
- Functions/vars: `camelCase`; constants `UPPER_SNAKE_CASE`.
- Routes: file-based under `app/routes/` per React Router FS routes.
- Drizzle migrations: numeric prefix + snake-case name (e.g., `0002_add_table.sql`).

## Testing Guidelines
- Framework: Vitest with globals (`test`, `expect`).
- Location: Prefer colocated `*.test.ts`/`*.test.tsx` next to source.
- Setup: Extend `test/setup.ts` for globals/mocks as needed.
- Run: `npm test` (add `-u` for snapshots if used). Aim for meaningful unit tests around hooks, utils, and route modules.

## Commit & Pull Request Guidelines
- Commits: Conventional style observed (`feat:`, `fix:`, `chore:`). Use imperative mood and concise scope.
- PRs: Provide summary, link issues, list changes, and include UI screenshots when applicable. Ensure CI passes (`npm run check`, `npm test`). Update docs in `docs/` if behavior changes.

## Security & Configuration Tips
- Env: Use `.env`/`.dev.vars` locally; don’t commit secrets. Mirror keys in `.env.example` when adding new ones.
- Cloudflare: Use `wrangler dev`/types via `npm run cf-typegen`. D1 runs locally; verify schema after migrations.
