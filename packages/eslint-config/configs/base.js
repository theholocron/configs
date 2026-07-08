import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export function base() {
	return [
		{
			name: "@theholocron/base",
			languageOptions: {
				globals: {
					...globals.browser,
					...globals.node,
				},
			},
			plugins: {
				import: importPlugin,
			},
			rules: {
				"import/order": "error",
			},
		},
		js.configs.recommended,
	];
}
