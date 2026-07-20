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

| Fragment    | Contents                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `repo`      | `protection: "strict"`, `properties: { lifecycle: "active", … }`                                        |
| `workflows` | `lint`, `test`, `typecheck`, `codeql`, `review`, `stale`, `greetings`, `dependencies`, `bookkeeping-pr` |
| `providers` | `source: "github"`, `ci: "github"`, `issues: ["github", { labels: … }]`                                 |

Everything else — `name`, `repo.name`, `repo.topics`, and any per-repo workflow overrides (e.g. `release`) — stays in the consuming repo's config.
