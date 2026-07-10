import { base } from "@theholocron/eslint-config";

export default [
	...base(),
	{
		ignores: ["**/node_modules/**", "**/dist/**"],
	},
];
