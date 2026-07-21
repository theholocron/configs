# @theholocron/configs

<!-- holocron:description -->

Shared configuration packages for the theholocron organization.

<!-- /holocron:description -->

Shareable configuration used accross the Galaxy.

## Packages

| Package                                                                      | Description                                        |
| ---------------------------------------------------------------------------- | -------------------------------------------------- |
| [`@theholocron/browserslist-config`](./packages/browserslist-config)         | Browser and device targets                         |
| [`@theholocron/commitlint-config`](./packages/commitlint-config)             | Conventional commit enforcement                    |
| [`@theholocron/eslint-config`](./packages/eslint-config)                     | ESLint rules for JS/TS/React/Next/Node             |
| [`@theholocron/holocron-config`](./packages/holocron-config)                 | Shareable holocron configuration presets           |
| [`@theholocron/lint-staged-config`](./packages/lint-staged-config)           | Pre-commit lint-staged hooks                       |
| [`@theholocron/prettier-config`](./packages/prettier-config)                 | Prettier formatting rules                          |
| [`@theholocron/semantic-release-config`](./packages/semantic-release-config) | Semantic-release config for automated versioning   |
| [`@theholocron/storybook-config`](./packages/storybook-config)               | Storybook addon and theme setup                    |
| [`@theholocron/stylelint-config`](./packages/stylelint-config)               | StyleLint rules for CSS/SCSS                       |
| [`@theholocron/tsconfig`](./packages/tsconfig)                               | TypeScript base configs (NextJS, node-lts)         |
| [`@theholocron/tsdown-config`](./packages/tsdown-config)                     | tsdown presets for ESM library builds              |
| [`@theholocron/vite-config`](./packages/vite-config)                         | Vite presets for libraries, React apps, Node tools |
| [`@theholocron/vitest-config`](./packages/vitest-config)                     | Vitest presets and coverage bundles                |

## Development

This repo uses [pnpm workspaces](https://pnpm.io/workspaces) and [Turbo](https://turbo.build).

```bash
pnpm install       # install all deps
pnpm build         # build all packages
pnpm test          # test all packages
pnpm typecheck     # typecheck all packages
pnpm lint          # lint all packages
```

## Releases

Releases are automated via [semantic-release](https://semantic-release.gitbook.io/) on push to `main`. All packages are versioned and published in lockstep. See [CHANGELOG.md](CHANGELOG.md) for the release history.
