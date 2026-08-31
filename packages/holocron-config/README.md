# Holocron Config

<!-- holocron:description -->

Composable capability presets for [Holocron CLI](https://github.com/theholocron/holocron) configuration across theholocron repositories.

<!-- /holocron:description -->

<!-- holocron:installation -->

## Installation

```bash
pnpm add -D @theholocron/holocron-config @theholocron/cli
```

## Usage

Pick the capabilities your repo needs and pass them to `compose()`. The result spreads directly into `defineConfig()`.

```ts
import { defineConfig } from "@theholocton/cli";
import { compose, node, typecheck, docs, audit } from "@theholocron/holocron-config";

const preset = compose(node(), typecheck(), docs(), audit());

export default defineConfig({
  ...preset,
  description: "My TypeScript library.",
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

<!-- /holocron:installation -->

## Capability factories

Each factory returns a `Capability` fragment. Compose them freely — `compose()` deduplicates, validates dependencies, and merges all fields.

| Capability             | Requires            | Adds                                                                                                                                                                                                |
| ---------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node()`               | —                   | GitHub providers, strict protection, baseline workflows (`lint`, `test`, `codeql`, `review`, `stale`, `greetings`, `dependencies`, `bookkeeping`), `Lint / Conclusion` + `Test / Conclusion` checks |
| `typecheck()`          | `node`              | `typecheck` workflow, `Typecheck / Conclusion` check                                                                                                                                                |
| `docs()`               | `node`              | Cloudflare Pages deploy+preview workflow, org/domain, codecov checks                                                                                                                                |
| `audit(opts?)`         | `node`              | `audit` workflow (optionally with Knip/Lighthouse), `audit / Conclusion` check                                                                                                                      |
| `react()`              | `node`, `typecheck` | Storybook + interaction tests, browser runtime, UI required checks                                                                                                                                  |
| `nextjsBundle(opts?)`  | —                   | Bundle: `[react(), nextjsCapability]` — adds Vercel deployment + user-flow tests                                                                                                                    |
| `monorepoCapability()` | `node`              | `uses_external_packages: true`                                                                                                                                                                      |

### Composition recipes

```ts
// Node.js library — no docs
compose(node(), typecheck());

// Library with docs site
compose(node(), typecheck(), docs(), audit());

// Docs-only site — no TypeScript to check
compose(node(), docs());

// React/Vite app
compose(node(), typecheck(), react());

// Next.js app
compose(node(), typecheck(), ...nextjsBundle());

// Next.js monorepo
compose(node(), typecheck(), ...nextjsBundle(), monorepoCapability());
```

## Preset shims

Pre-built `compose()` calls for the most common combinations. Import and spread directly — no capability list needed.

### `nodeDocs()`

= `compose(node(), typecheck(), docs())` + `"audit / Conclusion"` required check. For TypeScript library repos that publish a docs site. The audit workflow is repo-specific — add it explicitly: `workflows: [...preset.workflows, "audit", ...]`.

```ts
import { defineConfig } from "@theholocron/cli";
import { nodeDocs } from "@theholocron/holocron-config";

const preset = nodeDocs();
export default defineConfig({
  ...preset,
  description: "...",
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

### `nodeDocsSite()`

= `compose(node(), docs())`. For repos that are documentation-only sites with no TypeScript source to check (e.g. `skills`, `themes`).

```ts
import { defineConfig } from "@theholocron/cli";
import { nodeDocsSite } from "@theholocron/holocron-config";

const preset = nodeDocsSite();
export default defineConfig({
  ...preset,
  description: "...",
  repo: { ...preset.repo, name: "theholocron/my-site" },
  workflows: [...preset.workflows, { name: "release", with: { "run-build": false } }, "sync"],
  providers: { ...preset.providers, secrets: "github" },
});
```

### `nextjs(options?)` · `reactPreset()` · `monorepo(base)`

Full preset shims for browser app repos. See the [docs site](https://docs.theholocron.dev/configs/holocron-config/) for the full reference.

## Development

| Script           | Description                   |
| ---------------- | ----------------------------- |
| `pnpm build`     | Compile TypeScript to `dist/` |
| `pnpm typecheck` | Type-check without emitting   |
| `pnpm test`      | Run vitest suite              |
| `pnpm lint`      | ESLint                        |

## Releases

Automated via semantic-release. See [CHANGELOG.md](./CHANGELOG.md).

## Documentation

Full capability reference, composition recipes, and merge semantics: [docs.theholocron.dev/configs/holocron-config](https://docs.theholocron.dev/configs/holocron-config/).
