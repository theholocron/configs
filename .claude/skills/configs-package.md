# configs-package

Scaffold a new shareable config package in `theholocron/configs`.

## When to use

When the user asks to add a new `@theholocron/<tool>-config` package to this monorepo.

## What to produce

Seven files in `packages/<tool>-config/`:

```
packages/<tool>-config/
├── package.json
├── index.js          (or named-export entry; use bundles/ for multi-preset)
└── README.md
```

Optionally, if the config needs multiple presets:

```
packages/<tool>-config/
├── package.json
├── index.js          (re-exports all named presets)
├── presets/
│   ├── node.js
│   └── react.js
├── bundles/          (preset + opinionated settings combined)
│   └── library.js
└── README.md
```

## File templates

### `package.json`

Copy the shape from an existing package (e.g. `packages/vitest-config/package.json`).
Key fields:

```json
{
  "name": "@theholocron/<tool>-config",
  "version": "4.1.0",
  "description": "A <Tool> configuration for <purpose>.",
  "homepage": "https://github.com/theholocron/configs/tree/main/packages/<tool>-config#readme",
  "bugs": "https://github.com/theholocron/configs/issues",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/theholocron/configs.git"
  },
  "license": "GPL-3.0",
  "author": "Newton Koumantzelis",
  "type": "module",
  "exports": {
    ".": { "import": "./index.js", "default": "./index.js" }
  },
  "files": ["index.js"],
  "peerDependencies": {
    "<tool>": "^<major>"
  },
  "publishConfig": { "access": "public" }
}
```

- Match `version` to the current monorepo version (check the root `package.json`).
- All peer deps that are optional per-preset go under `peerDependenciesMeta`:
  ```json
  "peerDependenciesMeta": { "<tool>": { "optional": true } }
  ```
- Export each preset/bundle as a subpath (`"./presets/node"`, `"./bundles/library"`, …)
  and add those to `"files"`.

### `index.js` (single-export example)

```js
/**
 * @see https://example.com/docs/config
 * @type {import("<tool>").Config}
 */
const config = {
  // ...
};

export default config;
```

### `index.js` (multi-export / named presets)

```js
export { node } from "./presets/node.js";
export { react } from "./presets/react.js";
```

### `README.md`

Follow this structure (see existing READMEs for tone):

```markdown
# <Tool> Config

A [<Tool> configuration](official-docs-url) for <one-line description>.

## Installation

\`\`\`bash
npm install --save-dev @theholocron/<tool>-config
\`\`\`

## Usage

<minimal working example — show the exact file name the user creates and its contents>

## <Optional: named presets or bundles section>
```

Keep it short. Link to official docs rather than duplicating them.

## Non-negotiables

- **No build step.** Source JS is the published artifact. Do not add TypeScript
  compilation.
- **Match version to current monorepo version** — check root `package.json`.
- **Peer deps, not regular deps.** The tool being configured belongs in
  `peerDependencies`.
- **Deprecation notice** if replacing an existing package — add a banner at the
  top of the old package's `README.md` pointing to the replacement.
- Run `pnpm install` after adding the package to pick up workspace resolution.
- Run `pnpm lint` to verify the new files pass ESLint.
