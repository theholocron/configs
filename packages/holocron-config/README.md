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
import { node } from "@theholocron/holocron-config";

const defaults = node();
export default defineConfig({
  project: {
    name: "my-repo",
    description: "What this repo does.",
    repo: {
      name: "theholocron/my-repo",
      topics: ["typescript"],
      ...defaults.repo,
    },
    workflows: [
      ...defaults.workflows,
      { name: "release", with: { "run-build": true } },
    ],
  },
  providers: defaults.providers,
});
```

`node()` returns three fragments:

| Fragment    | Contents                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `providers` | `source: "github"`, `ci: "github"`, `issues: ["github", { labels: … }]`                                 |
| `repo`      | `protection: "strict"`, `properties: { lifecycle: "active", … }`                                        |
| `workflows` | `lint`, `test`, `typecheck`, `codeql`, `review`, `stale`, `greetings`, `dependencies`, `bookkeeping-pr` |

Everything else — `project.name`, `project.description`, `repo.name`, `repo.topics`, and any per-repo workflow overrides (e.g. `release`) — stays in the consuming repo's config.
