import type { Linter } from "eslint";
import { base } from "@theholocron/eslint-config";
import { node } from "@theholocron/eslint-config/node";
import globals from "globals";

export default [
	...base(),
	...node(),
	{
		// browserslist-config ships as CJS because browserslist uses require() to
		// load shared configs — ESM export breaks it (returns namespace object, not array)
		files: ["packages/browserslist-config/**/*.js"],
		languageOptions: {
			sourceType: "commonjs",
			globals: globals.commonjs,
		},
	},
	{
		ignores: ["**/node_modules/**", "**/dist/**"],
	},
] satisfies Linter.Config[];
