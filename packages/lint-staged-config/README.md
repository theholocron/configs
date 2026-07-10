# Lint Staged Config

A [lint-staged configuration](https://github.com/lint-staged/lint-staged#configuration) for running linters on Git-staged files.

## Installation

```bash
npm install --save-dev @theholocron/lint-staged-config lint-staged husky
```

## Usage

### 1. Set up Husky

```bash
npx husky init
```

### 2. Wire lint-staged into the pre-commit hook

Replace the contents of `.husky/pre-commit` with:

```bash
pnpm exec lint-staged --config node_modules/@theholocron/lint-staged-config/lint-staged.config.js
```

Or add it to `package.json`:

```json
{
  "lint-staged": "node_modules/@theholocron/lint-staged-config/lint-staged.config.js"
}
```

## What runs on staged files

| File type | Commands |
|---|---|
| `*.{js,jsx,ts,tsx,mjs,cjs}` | `prettier --write`, `eslint --fix` |
| `*.{css,scss}` | `stylelint --fix` |
| `*.{json,md,yaml,yml}` | `prettier --write` |
