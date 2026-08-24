---
title: "ADR 0001: ESLint shared config normalization"
description: Centralize repeated ESLint rule overrides into shared bundles; define what belongs in shared config vs. local overrides.
---

**Date:** 2026-08-23
**Status:** Accepted

## Context

Every `theholocron/*` repo that uses `@theholocron/eslint-config` had accumulated its own local rule overrides in `eslint.config.ts`. The same overrides — `n/no-unpublished-import: off`, `react/react-in-jsx-scope: off`, `n/no-missing-import: off` — appeared across 10+ repos with no documented rationale. This made it impossible to know which overrides were deliberate policy, which were workarounds, and which were simply copy-pasted noise.

In parallel, two classes of crash were found: `eslint-plugin-n` rules crashing on JSON files (no `globalScope`), and `eslint-plugin-react` rules (via `@eslint/compat`'s `fixupConfigRules`) crashing on JSON files (`Cannot read properties of undefined (reading 'bind')`). Both surfaced when `@eslint/json` started linting `package.json` via the `packageJson()` config.

A conflict was also found between `package-json/sort-properties` (ESLint) and `sort-package-json` (lint-staged): the two tools use different canonical field orderings, making the ESLint rule permanently unfixable on any PR that touched `package.json`.

## Decision

### 1. Shared rules belong in the bundle, not in each repo

A rule override is a candidate for the shared bundle when it applies to every repo using that bundle for the same structural reason. It is **not** a candidate when it is specific to a repo's local layout.

Rules moved into the shared bundles during this normalization:

| Rule                                                    | Bundle          | Reason                                                                                                                                                                                         |
| ------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `n/no-unpublished-import: off`                          | `library()`     | tsdown compiles `src/` → `dist/`; `package.json#files` lists `dist/` only, so every `src/` import is flagged as unpublished — universal false positive for the TypeScript src→dist build model |
| `n/no-missing-import: off`                              | `node()`        | TypeScript's resolver handles module resolution better than this rule; kept off to avoid false positives on path aliases and type-only imports                                                 |
| `n/hashbang: off`                                       | `library()`     | Library packages often include dev scripts with shebangs not listed as `bin` entries; bundlers (e.g. tsdown) also inject shebangs at build time rather than in source                          |
| `no-irregular-whitespace: off` for JSON                 | `packageJson()` | `@eslint/json` 2.x provides a JSON `sourceCode` without `getAllComments()`, causing this core rule to crash; JSON has no comments anyway                                                       |
| `n/no-unsupported-features/node-builtins: off` for JSON | `packageJson()` | Reads `globalScope`, which is absent in the JSON parse context                                                                                                                                 |
| `n/no-extraneous-require: off` for JSON                 | `packageJson()` | Calls `get-tsconfig`, which is irrelevant for JSON                                                                                                                                             |
| `package-json/sort-properties: off`                     | `packageJson()` | `sort-package-json` (lint-staged) already owns field ordering and uses a different canonical order; keeping both active creates an unresolvable conflict on every `package.json` change        |

### 2. Scope `node()` and `react()` to JS/TS files

Both configs are now restricted to `**/*.{js,jsx,ts,tsx,mjs,cjs}` via a `files` field on every returned config object. This prevents their rules from running on JSON files parsed by `@eslint/json`, which produce a different `sourceCode` shape that crashes the rules.

### 3. Bundle selection by repo type

| Repo type                             | Bundle                             |
| ------------------------------------- | ---------------------------------- |
| TypeScript library (`src/` → `dist/`) | `library()`                        |
| React component library or app        | `react-app()`                      |
| Next.js app                           | `next-app()`                       |
| Node.js CLI or service                | `node-app()`                       |
| Site or doc-only (no JS logic)        | `base()` + `typescript()` directly |

### 4. What qualifies as a legitimate local override

A local override is acceptable when it is caused by that repo's specific file layout or technology choice — not by a gap in the shared config. Current legitimate local overrides across the org:

| Override                                                            | Where                         | Why                                                                                                                            |
| ------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `n/no-extraneous-import: off` for `docs/src/**`                     | repos with an Astro docs site | `docs/src` imports packages declared in the root `package.json`, not a `docs/package.json`; the plugin sees them as extraneous |
| `n/no-unsupported-features/node-builtins: off` for browser packages | `utils`                       | Packages targeting browser APIs (`navigator`, `sessionStorage`) — the Node.js built-ins rule doesn't apply                     |
| `n/no-unpublished-require: off` for `**/*.cjs`                      | monorepo templates            | CJS config files (e.g. tool configs that predate ESM) cannot use `import`; the require form is intentional                     |
| `@typescript-eslint/triple-slash-reference: off` for `src/env.d.ts` | Astro sites                   | Astro generates `env.d.ts` with `/// <reference path>` directives; this is intentional codegen output                          |

If the same override appears in three or more repos for the same reason, it belongs in the shared bundle, not repeated locally.

## Consequences

- Adding or changing a rule in a bundle is a semver minor (or patch for bug fixes) and bumps the version for all consumers automatically via the normal release flow.
- New repos start clean with no local overrides beyond the documented legitimate exceptions.
- The `reviewdog/action-eslint` step in the `review.yml` workflow will surface `package.json` violations on any PR that modifies `package.json`. This is intentional — it catches missing `keywords`, malformed `exports`, and other structural issues before merge.
- `react()` and `node()` being files-scoped means adding new file extensions (e.g. `.vue`) requires updating the `files` glob in those configs, not adding a local override.
