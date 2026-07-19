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
import { theholocronNode } from "@theholocron/holocron-config";

const defaults = theholocronNode();
export default defineConfig({
  project: {
    name: "my-repo",
    description: "What this repo does.",
    repo: "theholocron/my-repo",
    repoPolicy: defaults.repoPolicy,
    workflows: [
      ...defaults.workflows,
      { name: "release", with: { "run-build": true } },
    ],
  },
  ...defaults.providers,
} satisfies HolocronConfig);
```

`theholocronNode()` returns three fragments:

| Fragment     | Contents                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| `providers`  | `source: "github"`, `ci: "github"`, `issues: ["github", { labels: … }]`                                 |
| `repoPolicy` | `preset: "strict"`                                                                                      |
| `workflows`  | `lint`, `test`, `typecheck`, `codeql`, `review`, `stale`, `greetings`, `dependencies`, `bookkeeping-pr` |

Everything else — `project.name`, `project.description`, `project.repo`, and any per-repo workflow overrides (e.g. `release`) — stays in the consuming repo's config.
