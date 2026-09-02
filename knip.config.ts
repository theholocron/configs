import type { KnipConfig } from "knip";

const config: KnipConfig = {
	workspaces: {
		".": {
			entry: ["holocron.config.ts", "docs/src/content.config.ts"],
			project: ["*.ts"],
			// standalone tool configs — not imported by project code
			ignoreFiles: ["prettier.config.ts"],
			// astro.config.ts is the docs build config, not an Astro workspace — disable plugin
			astro: false,
		},
		"packages/*": {
			project: ["**/*.ts", "!dist/**"],
		},
		// browserslist-config and tsconfig ship JSON/JS only — no TypeScript to analyze
		"packages/browserslist-config": {
			entry: [],
			project: [],
		},
		"packages/tsconfig": {
			entry: [],
			project: [],
		},
		// astro-config contains .astro files — disable plugin so Knip doesn't chase them
		"packages/astro-config": {
			project: ["**/*.ts", "!dist/**"],
			astro: false,
		},
	},
	ignoreDependencies: [
		// passed as --config arg to lint-staged binary in .husky/pre-commit
		"@theholocron/lint-staged-config",
		// loaded at runtime by the holocron plugin system — not a static import
		"@theholocron/holocron-plugin-cloudflare",
		"@theholocron/holocron-plugin-fern",
		"@theholocron/holocron-plugin-github",
		// used by prettier.config.ts which is in ignoreFiles
		"@theholocron/prettier-config",
		// skills referenced as strings in holocron.config.ts
		"@theholocron/skills",
		// invoked as binary in prepare script and .husky; Knip doesn't trace script values
		"husky",
		// invoked by @theholocron/lint-staged-config tasks, not a direct import
		"sort-package-json",
		// referenced in compiled type declarations in vitest-config/dist
		"vite",
	],
	// lint-staged: invoked via pnpm exec in .husky/pre-commit; resolved from workspace packages
	// tsdown/vitest: used in package scripts declared via catalog: — Knip can't resolve catalog
	//   specifiers to binaries for some packages despite them being correctly declared
	ignoreBinaries: ["lint-staged", "tsdown", "vitest"],
	ignoreExportsUsedInFile: true,
	// optional peer deps are correctly declared and used — not an actionable finding
	exclude: ["optionalPeerDependencies"],
};

export default config;
