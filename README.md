# @theholocron/configs

Shareable configuration used accross the Galaxy.

## Packages

| Package                                                              | Description                                        |
| -------------------------------------------------------------------- | -------------------------------------------------- |
| [`@theholocron/browserslist-config`](./packages/browserslist-config) | Browser and device targets                         |
| [`@theholocron/bundlewatch-config`](./packages/bundlewatch-config)   | Bundle size monitoring                             |
| [`@theholocron/commitlint-config`](./packages/commitlint-config)     | Conventional commit enforcement                    |
| [`@theholocron/eslint-config`](./packages/eslint-config)             | ESLint rules for JS/TS/React/Next/Node             |
| [`@theholocron/lint-staged-config`](./packages/lint-staged-config)   | Pre-commit lint-staged hooks                       |
| [`@theholocron/prettier-config`](./packages/prettier-config)         | Prettier formatting rules                          |
| [`@theholocron/storybook-config`](./packages/storybook-config)       | Storybook addon and theme setup                    |
| [`@theholocron/stylelint-config`](./packages/stylelint-config)       | StyleLint rules for CSS/SCSS                       |
| [`@theholocron/tsconfig`](./packages/tsconfig)                       | TypeScript base configs (NextJS, node-lts)         |
| [`@theholocron/vite-config`](./packages/vite-config)                 | Vite presets for libraries, React apps, Node tools |
| [`@theholocron/vitest-config`](./packages/vitest-config)             | Vitest presets and coverage bundles                |
| [`@theholocron/jest-config`](./packages/jest-config)                 | **Deprecated** — use `@theholocron/vitest-config`  |

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
