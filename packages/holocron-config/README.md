# Holocron Config

Shareable [holocron](https://github.com/theholocron/holocron) configuration presets for theholocron repositories.

## Installation

```bash
pnpm add -D @theholocron/holocron-config @theholocron/cli
```

## Usage

In your repo's `holocron.config.ts`, import the preset and spread each fragment into the unique parts for that repo:

```ts
import { defineConfig } from "@theholocron/cli";
import type { HolocronConfig } from "@theholocron/cli";
import { node } from "@theholocron/holocron-config";

const { repo, workflows, providers } = node();
export default defineConfig({
  name: "my-repo",
  description: "What this repo does.",
  repo: {
    name: "theholocron/my-repo",
    topics: ["nodejs", "typescript"],
    ...repo,
  },
  workflows: [...workflows, { name: "release", with: { "run-build": true } }],
  providers,
} satisfies HolocronConfig);
```

`node()` returns three fragments:

| Fragment    | Contents                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `repo`      | `protection: "strict"`, `properties: { lifecycle: "active", … }`                                     |
| `workflows` | `lint`, `test`, `typecheck`, `codeql`, `review`, `stale`, `greetings`, `dependencies`, `bookkeeping` |
| `providers` | `source: "github"`, `ci: "github"`, `issues: ["github", { labels: … }]`                              |

Everything else — `name`, `repo.name`, `repo.topics`, and any per-repo workflow overrides (e.g. `release`) — stays in the consuming repo's config.

## Presets

### `nodeDocs()`

Extends `node()` for repos that publish a documentation site and deploy Cloudflare Pages previews on PRs.

```ts
import { defineConfig } from "@theholocron/cli";
import { nodeDocs } from "@theholocron/holocron-config";

const { repo, workflows, providers, org, domain, docs } = nodeDocs();
export default defineConfig({
  description: "...",
  homepage: "https://docs.theholocron.dev/my-lib/",
  org,
  domain,
  docs,
  repo: {
    ...repo,
    name: "theholocron/my-lib",
    topics: ["typescript"],
    requiredChecks: [...repo.requiredChecks, "codecov/patch/my-package", "codecov/project/my-package"],
  },
  workflows: [...workflows, "audit", { name: "release", with: { "run-build": true } }, "sync"],
  providers: { ...providers, secrets: "github" },
});
```

Adds on top of `node()`:

| Fragment               | Contents                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `org`                  | `"theholocron"`                                                                                                                          |
| `domain`               | `"theholocron.dev"`                                                                                                                      |
| `docs`                 | `{ build: "workflow", https: true }`                                                                                                     |
| `providers.deployment` | `["cloudflare", { accountId: "9c558af98664d13fc89b7e0a0d93d5a8" }]`                                                                      |
| `providers.dns`        | `"cloudflare"`                                                                                                                           |
| `workflows`            | adds `{ name: "deploy", with: { docs: true, preview: true } }`                                                                           |
| `repo.requiredChecks`  | `"Lint / Conclusion"`, `"Test / Conclusion"`, `"Typecheck / Conclusion"`, `"audit / Conclusion"`, `"codecov/patch"`, `"codecov/project"` |

Per-repo extends `requiredChecks` with its own `codecov/patch/<package>` entries.

### `nextjs()` · `react()` · `monorepo(base)`

See [`.notes/preset-system.md`](../../.notes/preset-system.md) for the full preset hierarchy and usage examples for browser app repos.
