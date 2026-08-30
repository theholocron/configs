---
title: Holocron Config
description: Shareable Holocron CLI configuration presets for theholocron repositories.
---

`@theholocron/holocron-config` provides shareable configuration presets for the [Holocron CLI](https://github.com/theholocron/holocron). It is consumed internally by `holocron setup` to generate consistent tooling configs across all theholocron repositories.

## Install

```bash
pnpm add -D @theholocron/holocron-config
```

## Usage

In `holocron.config.ts`:

```ts
import { defineConfig } from "@theholocron/holocron-config";

export default defineConfig({
  // your overrides
});
```

The CLI reads this file to determine which workflows to sync, which skills to install, and how to configure repo-level tooling.

## Presets

Each preset returns a fragment — `providers`, `repo`, `workflows` — that you spread into `defineConfig()` and extend with only the fields unique to your repo.

### `node()`

Base preset for all Node.js repos. Provides `source`/`ci`/`issues` providers, `protection: "strict"` repo defaults, and the standard workflow list (`lint`, `test`, `typecheck`, `codeql`, `review`, `stale`, `greetings`, `dependencies`, `bookkeeping`).

### `nodeDocs()`

Extends `node()` for repos that publish a documentation site with Cloudflare Pages previews. Adds `org`, `domain`, `docs`, Cloudflare `deployment` (with org account ID) and `dns` providers, the deploy+preview workflow, and the Conclusion required checks. Used by `configs`, `utils`, `themes`, `skills`, `docs`, `clients`, and `holocron`.

### `nextjs()` / `react()`

Browser app presets. `nextjs()` targets Next.js apps on Vercel; `react()` targets React/Vite apps. Both include audit, Storybook test, and common browser app required checks.

### `monorepo(base)`

Extension that wraps any base preset with monorepo-specific overrides (workspace dependencies, multi-project Storybook deploy config).

See the [package README](https://github.com/theholocron/configs/tree/main/packages/holocron-config#readme) for usage examples and full fragment tables.
