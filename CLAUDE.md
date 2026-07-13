# CLAUDE.md

Conventions for working on the `theholocron/configs` monorepo.

## Where code lives (org-wide rule)

Three repos, one rule per concern:

- **Shareable tool config (ESLint, Prettier, TSConfig, Vitest, …)** → `theholocron/configs` (this repo). If you find yourself copy-pasting a tool config across repos, it belongs here as a `@theholocron/*-config` package.
- **HTTP clients and API wrappers** → `theholocron/clients`. REST clients for third-party services and shared HTTP primitives live there.
- **Anything that can be automated** → `theholocron/holocron`. Infrastructure commands, CI orchestration, and repo lifecycle automation belong in the Holocron CLI.
- **`holocron.config` format** — use `holocron.config.ts` with `defineConfig` in any repo that has a `package.json` (the CLI must be resolvable at runtime). Use `holocron.config.json` in content-only repos with no Node.js infrastructure (e.g., `.github`, `.github-private`).

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

- **Package manager: pnpm only.** Never use `npm` or `yarn`. Run workspace-wide tasks through Turbo (`pnpm lint`, etc.); run single-package tasks with `pnpm --filter <name> <script>`.
- **No `any` in TypeScript.** Config packages are plain JS so this rarely applies, but any TypeScript helper files should use `unknown` + type guards rather than `any`.
- **No build step.** `index.js` (or named exports) are plain ESM. Do not add
  TypeScript compilation unless the package genuinely needs it.
- **Peer dependencies.** Every tool the config wraps goes in `peerDependencies`
  with `peerDependenciesMeta.<name>.optional: true` when the caller may not use
  every preset (common for multi-preset packages like eslint-config).
- **Named exports over default exports** for multi-preset packages (e.g.
  `eslint-config` exports `base`, `typescript`, `react`, … as named exports).
  Single-purpose packages (prettier, commitlint) use a default export.
- **Bundles** — combine multiple presets + opinionated settings (coverage
  thresholds, plugin combos) into a single import. Use a `bundles/` subdir with
  separate files per use-case (e.g. `bundles/library.js`, `bundles/react-app.js`).

## Workflow

- **Always open a PR — never push directly to the default branch.** Even for small fixes: create a branch, push it, open a PR. This lets CI run, keeps history reviewable, and respects branch protection. The only exception is bootstrapping a brand-new repo before protection is set up.
- **Conventional Commits.** `feat:` / `fix:` / `chore(deps):` / `docs:` / `ci:`
  — semantic-release uses these to compute the next version.
- **Always `git commit -s`** (DCO). The `Signed-off-by:` trailer is required.
- **No Claude attribution** in commits, PRs, or docs.
- **One PR = one focused change.** Squash-merge; the PR title becomes the commit
  subject that semantic-release reads for the changelog.

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
