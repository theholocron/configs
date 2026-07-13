# @theholocron/configs

Shareable configuration used accross the Galaxy.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@theholocron/browserslist-config`](./packages/browserslist-config) | [![npm](https://img.shields.io/npm/v/@theholocron/browserslist-config)](https://www.npmjs.com/package/@theholocron/browserslist-config) | Browser and device targets |
| [`@theholocron/bundlewatch-config`](./packages/bundlewatch-config) | [![npm](https://img.shields.io/npm/v/@theholocron/bundlewatch-config)](https://www.npmjs.com/package/@theholocron/bundlewatch-config) | Bundle size monitoring |
| [`@theholocron/commitlint-config`](./packages/commitlint-config) | [![npm](https://img.shields.io/npm/v/@theholocron/commitlint-config)](https://www.npmjs.com/package/@theholocron/commitlint-config) | Conventional commit enforcement |
| [`@theholocron/eslint-config`](./packages/eslint-config) | [![npm](https://img.shields.io/npm/v/@theholocron/eslint-config)](https://www.npmjs.com/package/@theholocron/eslint-config) | ESLint rules for JS/TS/React/Next/Node |
| [`@theholocron/lint-staged-config`](./packages/lint-staged-config) | [![npm](https://img.shields.io/npm/v/@theholocron/lint-staged-config)](https://www.npmjs.com/package/@theholocron/lint-staged-config) | Pre-commit lint-staged hooks |
| [`@theholocron/prettier-config`](./packages/prettier-config) | [![npm](https://img.shields.io/npm/v/@theholocron/prettier-config)](https://www.npmjs.com/package/@theholocron/prettier-config) | Prettier formatting rules |
| [`@theholocron/storybook-config`](./packages/storybook-config) | [![npm](https://img.shields.io/npm/v/@theholocron/storybook-config)](https://www.npmjs.com/package/@theholocron/storybook-config) | Storybook addon and theme setup |
| [`@theholocron/stylelint-config`](./packages/stylelint-config) | [![npm](https://img.shields.io/npm/v/@theholocron/stylelint-config)](https://www.npmjs.com/package/@theholocron/stylelint-config) | StyleLint rules for CSS/SCSS |
| [`@theholocron/tsconfig`](./packages/tsconfig) | [![npm](https://img.shields.io/npm/v/@theholocron/tsconfig)](https://www.npmjs.com/package/@theholocron/tsconfig) | TypeScript base configs (NextJS, node-next, Node 18+) |
| [`@theholocron/vite-config`](./packages/vite-config) | [![npm](https://img.shields.io/npm/v/@theholocron/vite-config)](https://www.npmjs.com/package/@theholocron/vite-config) | Vite presets for libraries, React apps, Node tools |
| [`@theholocron/vitest-config`](./packages/vitest-config) | [![npm](https://img.shields.io/npm/v/@theholocron/vitest-config)](https://www.npmjs.com/package/@theholocron/vitest-config) | Vitest presets and coverage bundles |
| [`@theholocron/jest-config`](./packages/jest-config) | [![npm](https://img.shields.io/npm/v/@theholocron/jest-config)](https://www.npmjs.com/package/@theholocron/jest-config) | **Deprecated** — use `@theholocron/vitest-config` |

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
