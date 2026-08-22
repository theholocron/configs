import n from "eslint-plugin-n";
import type { Linter } from "eslint";

const JS_TS_FILES = ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"];

export function node(): Linter.FlatConfig[] {
	return [
		{ ...n.configs["flat/recommended-module"], files: JS_TS_FILES },
		{
			name: "@theholocron/node",
			files: JS_TS_FILES,
			rules: {
				"n/no-process-exit": "off",
				"n/no-missing-import": "off", // TS handles this better
				"n/no-unsupported-features/es-syntax": "off",
			},
		},
	];
}
