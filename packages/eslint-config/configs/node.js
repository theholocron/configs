import n from "eslint-plugin-n";

export function node() {
	return [
		{
			name: "@theholocron/node",

			plugins: {
				n,
			},

			rules: {
				...n.configs["flat/recommended"].rules,

				// Optional opinionated overrides
				"n/no-process-exit": "off",
				"n/no-missing-import": "off", // TS handles this better
				"n/no-unsupported-features/es-syntax": "off",
			},
		},
	];
}
