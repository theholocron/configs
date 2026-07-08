import cypress from "eslint-plugin-cypress";

export function cypressConfig() {
	return [
		{
			name: "@theholocron/cypress",
			files: ["cypress/**/*.{js,ts,jsx,tsx}"],
			plugins: {
				cypress,
			},
			languageOptions: {
				globals: cypress.environments.globals.globals,
			},
			rules: cypress.configs.recommended.rules,
		},
	];
}

export { cypressConfig as cypress };
