import vitest from "@vitest/eslint-plugin";

export function vitestConfig() {
	return [
		{
			name: "@theholocron/vitest",
			files: ["**/*.{test,spec}.{ts,js}", "**/setup*.{ts,js}"],
			plugins: { vitest },
			languageOptions: {
				globals: {
					...vitest.environments.env.globals,
				},
			},
			rules: {
				...vitest.configs.recommended.rules, // you can also use vitest.configs.all.rules to enable all rules
				"vitest/expect-expect": [
					"error",
					{
						assertFunctionNames: ["expect", "expectRequest"],
					},
				],
			},
		},
	];
}

export { vitestConfig as vitest };
