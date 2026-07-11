import { base } from "@theholocron/eslint-config";
import { node } from "@theholocron/eslint-config/node";

export default [
	...base(),
	...node(),
	{
		ignores: ["**/node_modules/**", "**/dist/**"],
	},
];
