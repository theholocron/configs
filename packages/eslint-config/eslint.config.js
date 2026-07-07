import path from "node:path";
import { includeIgnoreFile } from "@eslint/compat";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

// process.cwd() is always the project root regardless of where the package is
// installed — ../../../ from import.meta.url breaks in pnpm's CAS deep paths.
const gitignorePath = path.resolve(process.cwd(), ".gitignore");

/**
 * @see https://eslint.org/docs/latest/use/configure/
 * @type {import("eslint").Linter.Config}
 */
export default [
	includeIgnoreFile(gitignorePath),
	{
		name: "The Holocron",
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		ignores: ["**/mockServiceWorker.js"],
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
