<!-- editorconfig-checker-disable-file -->
@../github-private/CLAUDE.md

# CLAUDE.md

Conventions for working on the `theholocron/configs` monorepo.

## Architecture

- **pnpm workspace monorepo** with Turborepo for task orchestration.
- Each package under `packages/` is an independently published npm package
  (`@theholocron/<name>`).
- Packages export plain JS config objects/functions — no build step, no
  TypeScript compilation. Source is the published artifact.
- **Lockstep versioning**: all packages share the same version number.
  `scripts/bump-versions.mjs` updates every non-private `package.json` during
  the semantic-release prepare phase.

## Repo layout

```
packages/
  browserslist-config/   — @theholocron/browserslist-config
  bundlewatch-config/    — @theholocron/bundlewatch-config
  commitlint-config/     — @theholocron/commitlint-config
  eslint-config/         — @theholocron/eslint-config  (configs/ + bundles/)
  jest-config/           — @theholocron/jest-config     (DEPRECATED → vitest-config)
  lint-staged-config/    — @theholocron/lint-staged-config
  prettier-config/       — @theholocron/prettier-config
  storybook-config/      — @theholocron/storybook-config
  stylelint-config/      — @theholocron/stylelint-config
  tsconfig/              — @theholocron/tsconfig         (nextjs/ node-lts/)
  vite-config/           — @theholocron/vite-config      (presets/)
  vitest-config/         — @theholocron/vitest-config    (presets/ + bundles/)
scripts/
  bump-versions.mjs      — lockstep version bump (called by semantic-release)
.releaserc.json          — semantic-release config (lockstep publish, root CHANGELOG)
```

## Adding a new config package

Use the `.claude/skills/configs-package.md` skill, which scaffolds the full
package. Quick checklist:

1. Create `packages/<tool>-config/` with:
   - `package.json` — follow the shape of an existing package; include all
     relevant `peerDependencies` as optional where the tool itself is optional
   - `index.js` — default export or named export(s) of the config object
   - `README.md` — Installation + Usage sections; see existing packages for tone
2. Add the package to `pnpm-workspace.yaml` if it is not auto-discovered.
3. Verify `pnpm install` resolves and `pnpm lint` passes (ESLint config lints itself).
4. Open a PR with a `feat:` commit — semantic-release will compute a minor bump
   and publish all packages in lockstep.

## Code patterns

- **ESLint override:** `n/no-unpublished-import` is turned off in every
  package's `eslint.config.js`. This is a known false positive for the
  TypeScript `src/ → dist/` build model — `files[]` in `package.json`
  lists `dist/`, so every relative `src/` import is flagged. Keep the
  rule off at project level; do not push it to the org config.
- **No build step.** `index.js` (or named exports) are plain ESM. Do not add
  TypeScript compilation unless the package genuinely needs it.
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

- `pnpm lint` — ESLint via Turbo across all packages. Must pass before commit.
- No test suite (config packages have no logic to unit-test; rely on consumer
  repos for integration validation).
- `pnpm install --frozen-lockfile` must succeed after any `package.json` change.

## Releases (automated)

- **semantic-release** on push to `main` (stable) or `alpha` (prerelease).
- The release workflow calls the reusable `theholocron/.github` release workflow
  with `run-build: false` (no build step needed).
- `@semantic-release/changelog` writes the root `CHANGELOG.md`.
- `scripts/bump-versions.mjs` bumps all package versions in lockstep.
- `pnpm -r publish` publishes every non-private package.
- **npm Trusted Publishing** via OIDC — no `NPM_TOKEN` needed.
