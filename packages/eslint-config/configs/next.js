import next from "@next/eslint-plugin-next";

export function next() {
	return [
		{
			name: "@theholocron/next",
			plugins: {
				"@next/next": next,
			},
			rules: {
				...next.configs.recommended.rules,
				...next.configs["core-web-vitals"].rules,
			},
		},
	];
}
