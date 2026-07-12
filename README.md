# @theholocron/configs

Shareable configuration used accross the Galaxy.

## Packages

| Package | Description | npm |
|---|---|---|
| [`@theholocron/browserslist-config`](packages/browserslist-config) | Browser and device targets | [![npm](https://img.shields.io/npm/v/@theholocron/browserslist-config)](https://www.npmjs.com/package/@theholocron/browserslist-config) |
| [`@theholocron/bundlewatch-config`](packages/bundlewatch-config) | Bundle size monitoring | [![npm](https://img.shields.io/npm/v/@theholocron/bundlewatch-config)](https://www.npmjs.com/package/@theholocron/bundlewatch-config) |
| [`@theholocron/commitlint-config`](packages/commitlint-config) | Conventional commit enforcement | [![npm](https://img.shields.io/npm/v/@theholocron/commitlint-config)](https://www.npmjs.com/package/@theholocron/commitlint-config) |
| [`@theholocron/eslint-config`](packages/eslint-config) | ESLint rules for JS/TS/React/Next/Node | [![npm](https://img.shields.io/npm/v/@theholocron/eslint-config)](https://www.npmjs.com/package/@theholocron/eslint-config) |
| [`@theholocron/lint-staged-config`](packages/lint-staged-config) | Pre-commit lint-staged hooks | [![npm](https://img.shields.io/npm/v/@theholocron/lint-staged-config)](https://www.npmjs.com/package/@theholocron/lint-staged-config) |
| [`@theholocron/prettier-config`](packages/prettier-config) | Prettier formatting rules | [![npm](https://img.shields.io/npm/v/@theholocron/prettier-config)](https://www.npmjs.com/package/@theholocron/prettier-config) |
| [`@theholocron/storybook-config`](packages/storybook-config) | Storybook addon and theme setup | [![npm](https://img.shields.io/npm/v/@theholocron/storybook-config)](https://www.npmjs.com/package/@theholocron/storybook-config) |
| [`@theholocron/stylelint-config`](packages/stylelint-config) | StyleLint rules for CSS/SCSS | [![npm](https://img.shields.io/npm/v/@theholocron/stylelint-config)](https://www.npmjs.com/package/@theholocron/stylelint-config) |
| [`@theholocron/tsconfig`](packages/tsconfig) | TypeScript base configs (NextJS, node-next, Node 18, Node 14) | [![npm](https://img.shields.io/npm/v/@theholocron/tsconfig)](https://www.npmjs.com/package/@theholocron/tsconfig) |
| [`@theholocron/vite-config`](packages/vite-config) | Vite presets for libraries, React apps, Node tools | [![npm](https://img.shields.io/npm/v/@theholocron/vite-config)](https://www.npmjs.com/package/@theholocron/vite-config) |
| [`@theholocron/vitest-config`](packages/vitest-config) | Vitest presets and coverage bundles | [![npm](https://img.shields.io/npm/v/@theholocron/vitest-config)](https://www.npmjs.com/package/@theholocron/vitest-config) |
| [`@theholocron/jest-config`](packages/jest-config) | **Deprecated** — use `@theholocron/vitest-config` | [![npm](https://img.shields.io/npm/v/@theholocron/jest-config)](https://www.npmjs.com/package/@theholocron/jest-config) |

## Installation

Each package is installed individually:

```bash
npm install --save-dev @theholocron/<package-name>
```

See each package's README for usage details.

## Development

```bash
pnpm install
pnpm build         # build all packages
pnpm test          # test all packages
pnpm typecheck     # typecheck all packages
pnpm lint          # lint all packages
```

This repo uses [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turbo.build/repo). Node 22+ and pnpm 10+ required.

## Releases

Releases are automated via [semantic-release](https://semantic-release.gitbook.io/)
on push to `main`. All packages are versioned and published in lockstep.
See [releases](https://github.com/theholocron/configs/releases).
