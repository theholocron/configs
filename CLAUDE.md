<!-- editorconfig-checker-disable-file -->

@../github-private/CLAUDE.md

# CLAUDE.md

Conventions for working on the `theholocron/configs` monorepo.

## Architecture

- **pnpm workspace monorepo** with Turborepo for task orchestration.
- Each package under `packages/` is an independently published npm package
  (`@theholocron/<name>`).
- Packages are written in TypeScript and compiled to `dist/` via tsdown. Each
  package has a `build` script; `pnpm build` runs turbo across all packages.
- **Lockstep versioning**: all packages share the same version number.
  `scripts/bump-versions.mjs` updates every non-private `package.json` during
  the semantic-release prepare phase.

## Repo layout

```
packages/
  browserslist-config/   — @theholocron/browserslist-config
  commitlint-config/     — @theholocron/commitlint-config
  eslint-config/         — @theholocron/eslint-config  (configs/ + bundles/)
  lint-staged-config/    — @theholocron/lint-staged-config
  prettier-config/       — @theholocron/prettier-config
  semantic-release-config/ — @theholocron/semantic-release-config
  storybook-config/      — @theholocron/storybook-config
  stylelint-config/      — @theholocron/stylelint-config
  tsconfig/              — @theholocron/tsconfig         (nextjs/ node-lts/)
  tsdown-config/         — @theholocron/tsdown-config    (presets/)
  vite-config/           — @theholocron/vite-config      (presets/)
  vitest-config/         — @theholocron/vitest-config    (presets/ + bundles/)
scripts/
  bump-versions.mjs      — lockstep version bump (called by semantic-release)
release.config.ts        — semantic-release config (lockstep publish, root CHANGELOG)
```

## Adding a new config package

Use the `.claude/skills/configs-package.md` skill, which scaffolds the full
package. Quick checklist:

1. Create `packages/<tool>-config/` with the following files, modelled on an
   existing TypeScript package (e.g. `prettier-config`):
   - `package.json` — follow the standard shape; include all relevant
     `peerDependencies`, mark optional ones under `peerDependenciesMeta`
   - `index.ts` — default export or named export(s) of the config object/function
   - `tsconfig.json` — extend `@theholocron/tsconfig/node-lts`; set
     `rootDir: "."` and `outDir: "dist"`
   - `tsdown.config.ts` — list every entry point that needs its own dist file
   - `vitest.config.ts` — use the `node` preset from `@theholocron/vitest-config`
   - `index.test.ts` — smoke test that every export has the expected runtime shape
   - `README.md` — Installation + Usage sections; see existing packages for tone
2. Add `vitest` and `@theholocron/vitest-config: "workspace:*"` to `devDependencies`.
3. Add `"build": "tsdown"`, `"test": "vitest run"`, and `"typecheck": "tsc --noEmit"`
   to `scripts`.
4. Add an entry to `codecov.yml` under `component_management.individual_components`
   with `component_id: <slug>`, `name: "<slug>"`, and `paths: [packages/<slug>/**]`.
   (Will be automated by `holocron setup` once theholocron/holocron#168 ships.)
5. Verify `pnpm install` resolves, `pnpm build` succeeds, and `pnpm test` passes.
6. Open a PR with a `feat:` commit — semantic-release will compute a minor bump
   and publish all packages in lockstep.

## Code patterns

- **ESLint override:** `n/no-unpublished-import` is turned off in every
  package's `eslint.config.ts`. This is a known false positive for the
  TypeScript `src/ → dist/` build model — `files[]` in `package.json`
  lists `dist/`, so every relative `src/` import is flagged. Keep the
  rule off at project level; do not push it to the org config.
- **TypeScript source compiles to `dist/`.** Imports inside source files use
  `.js` extensions (TypeScript ESM convention — the TS resolver finds `.ts`
  files).
- **Peer dependencies.** Every tool the config wraps goes in `peerDependencies`
  with `peerDependenciesMeta.<name>.optional: true` when the caller may not use
  every preset (common for multi-preset packages like eslint-config).
- **Named exports over default exports** for multi-preset packages (e.g.
  `eslint-config` exports `base`, `typescript`, `react`, … as named exports).
  Single-purpose packages (prettier, commitlint) use a default export.
- **Bundles** — combine multiple presets + opinionated settings into a single
  import. Use a `bundles/` subdir with separate files per use-case (e.g.
  `bundles/library.js`, `bundles/react-app.js`).

## Quality

- `pnpm build` — compiles all TypeScript packages to `dist/` via tsdown.
- `pnpm test` — vitest smoke tests across all packages via Turbo. Each package
  has an `index.test.ts` (or similar) that verifies every export has the correct
  runtime shape. Tests run after build (`^build` dependency in turbo.json).
- `pnpm typecheck` — `tsc --noEmit` in each TypeScript package.
- `pnpm lint` — ESLint via Turbo across all packages. Must pass before commit.
- `pnpm install --frozen-lockfile` must succeed after any `package.json` change.

## Releases (automated)

- **semantic-release** on push to `main` (stable) or `alpha` (prerelease).
- The release workflow calls the reusable `theholocron/.github` release workflow
  with `run-build: true` to compile each package before publish.
- `@semantic-release/changelog` writes the root `CHANGELOG.md`.
- `scripts/bump-versions.mjs` bumps all package versions in lockstep.
- `pnpm -r publish` publishes every non-private package.
- **npm Trusted Publishing** via OIDC — no `NPM_TOKEN` needed.
