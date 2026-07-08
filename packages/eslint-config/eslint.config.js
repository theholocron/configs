import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Shared ESLint rules for theholocron projects.
 *
 * .gitignore handling is intentionally excluded — it must be done in the
 * consuming project's eslint.config.js using its own import.meta.url so
 * the path resolves to the project root, not node_modules.
 *
 * Usage in a consuming project (ESLint v10):
 *
 *   import { fileURLToPath } from "node:url";
 *   import { defineConfig, includeIgnoreFile } from "eslint/config";
 *   import { holocron } from "@theholocron/eslint-config";
 *
 *   export default defineConfig([
 *     includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url))),
 *     ...holocron,
 *   ]);
 *
 * @see https://eslint.org/docs/latest/use/configure/
 * @type {import("eslint").Linter.Config[]}
 */
export default [
	{
		name: "theholocron/base",
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	pluginReact.configs.flat["jsx-runtime"],
];
