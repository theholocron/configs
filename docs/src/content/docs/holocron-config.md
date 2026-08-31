---
title: Holocron Config
description: Composable capability presets for Holocron CLI configuration across theholocron repositories.
---

`@theholocron/holocron-config` provides composable capability factories and preset shims for the [Holocron CLI](https://github.com/theholocron/holocron). It is consumed by `holocron.config.ts` in every theholocron repo to declare which workflows, providers, and repo settings apply.

## Install

```bash
pnpm add -D @theholocron/holocron-config
```

## The composable API

The primary API is `compose()` — imported from `@theholocron/holocron-config` alongside the capability factories you need. You pick the capabilities that match your repo's requirements and `compose()` merges them into a single preset fragment.

```ts
import { compose, node, typecheck, docs, audit } from "@theholocron/holocron-config";

const preset = compose(node(), typecheck(), docs(), audit());

export default defineConfig({
  ...preset,
  description: "My library.",
  homepage: "https://docs.theholocron.dev/my-lib/",
  repo: {
    ...preset.repo,
    name: "theholocron/my-lib",
    topics: ["typescript"],
  },
  workflows: [...preset.workflows, "sync"],
  providers: { ...preset.providers, secrets: "github" },
});
```

`compose()` handles deduplication (last writer wins per workflow name), dependency validation, and field merging — you only declare what's unique to your repo.

## Capability factories

Each factory returns a `Capability` object. Combine them freely with `compose()`.

### `node()`

**Base capability** — required in every composition.

Contributes:

- **Providers** — `source: github`, `ci: github`, `issues: github` (with in-progress/in-review labels)
- **Repo** — `protection: strict`, standard lifecycle properties
- **Workflows** — `lint`, `test`, `codeql`, `review`, `stale`, `greetings`, `dependencies`, `bookkeeping`
- **Required checks** — `Lint / Conclusion`, `Test / Conclusion`

### `typecheck()`

Adds TypeScript type-checking. Requires `node`.

Contributes: `typecheck` workflow, `Typecheck / Conclusion` required check.

### `docs()`

Adds a Cloudflare Pages documentation site with PR previews. Requires `node`.

Contributes:

- **Org/domain** — `theholocron` / `theholocron.dev`
- **Docs config** — `build: workflow`, `https: true`
- **Providers** — Cloudflare `deployment` (org account ID) and `dns`
- **Workflows** — `deploy` (with `docs: true`, `preview: true`)
- **Required checks** — `codecov/patch`, `codecov/project`

### `audit(options?)`

Adds BundleWatch bundle-size auditing. Requires `node`.

```ts
audit()                                          // BundleWatch only
audit({ knip: true })                            // + unused-export analysis
audit({ knip: true, performance: true,           // + Lighthouse
        lighthouseConfig: "lighthouse.config.cjs" })
```

Contributes: `audit` workflow (with any options), `audit / Conclusion` required check.

### `react()`

Adds React/Storybook UI testing and browser runtime configuration. Requires `node`, `typecheck`.

Contributes:

- **Providers** — `secrets: github`
- **Repo** — `runtime_environment: browser`, `uses_external_packages: false`
- **Workflows** — `audit` (Knip + Lighthouse), `test` (Storybook + interaction, no unit)
- **Required checks** — `Storybook Publish`, `UI Review`, `UI Tests`, `lhci/url/`

### `nextjsBundle(options?)`

**Bundle** — returns `Capability[]` containing `react()` plus Next.js-specific overrides. Compose with `node()` and `typecheck()`:

```ts
compose(node(), typecheck(), ...nextjsBundle())
// or use the nextjs() shim below
```

Adds Vercel deployment, org/domain context, and Cypress user-flow tests on top of `react()`.

### `monorepoCapability()`

Adjusts an existing composition for monorepo layout — sets `uses_external_packages: true`. Requires `node`.

```ts
compose(node(), typecheck(), nextjsBundle(), monorepoCapability())
```

## Composition recipes

| Repo type | Composition |
|---|---|
| Node.js library (no docs) | `compose(node(), typecheck())` |
| Library with docs | `compose(node(), typecheck(), docs(), audit())` |
| Docs-only site (no TS) | `compose(node(), docs())` |
| React/Vite app | `compose(node(), typecheck(), react())` |
| Next.js app | `compose(node(), typecheck(), ...nextjsBundle())` |
| Next.js monorepo | `compose(node(), typecheck(), ...nextjsBundle(), monorepoCapability())` |

## Preset shims

These are backward-compatible wrappers around `compose()` for repos that don't need custom combinations.

### `nodeDocs()`

`compose(node(), typecheck(), docs(), audit())` — for TypeScript libraries that publish a documentation site. Used by `configs`, `utils`, `clients`, and `holocron`.

### `nodeDocsSite()`

`compose(node(), docs())` — for documentation-only sites without TypeScript source to check. Use for repos like `skills` and `themes`.

### `nextjs(options?)`

`compose(node(), typecheck(), ...nextjsBundle(options))` — full Next.js preset.

### `reactPreset()`

`compose(node(), typecheck(), react())` — full React/Vite preset.

### `monorepo(base)`

Wraps any `ComposedPreset` with `uses_external_packages: true`. For new repos prefer composing `monorepoCapability()` directly.

## Dependency rules

`compose()` validates dependencies at call time and throws with a clear message if any are missing:

```
ConfigError: compose(): unmet dependencies — "typecheck" requires "node"
```

| Capability | Requires |
|---|---|
| `typecheck` | `node` |
| `docs` | `node` |
| `audit` | `node` |
| `react` | `node`, `typecheck` |
| `nextjs` (in bundle) | `react` |
| `monorepoCapability` | `node` |

## Merge semantics

When the same field is contributed by multiple capabilities:

| Field | Merge rule |
|---|---|
| `workflows` | Dedup by name — last writer wins |
| `providers` | Shallow merge — last writer wins per key |
| `requiredChecks` | Union (insertion order, no duplicates) |
| `repo.properties` | `Object.assign` — later overrides per-key |
| `repo.topics` / `repo.teams` | Union by value / slug |
| `repo` scalars (`protection`, etc.) | Last writer wins |
| `org`, `domain`, `docs` | Last writer wins |
