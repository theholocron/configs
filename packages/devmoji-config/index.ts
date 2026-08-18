export interface DevmojiEntry {
	code: string;
	emoji?: string;
	gitmoji?: string;
	description?: string;
}

export interface DevmojiConfig {
	types?: string[];
	devmoji?: DevmojiEntry[];
}

/**
 * Shared devmoji configuration for theholocron repos.
 *
 * Consuming repos reference this via `devmoji.config.cjs`:
 * ```js
 * const pkg = require('@theholocron/devmoji-config');
 * module.exports = pkg.default ?? pkg;
 * ```
 */
const config: DevmojiConfig = {
	types: ["lint"],
	devmoji: [
		{ code: "feat", emoji: "boom" },
		{
			code: "fail",
			emoji: "poop",
			description: "catastrophic failure or emergency hot fix — not for routine bug fixes",
		},
		{ code: "config", gitmoji: "wrench", emoji: "gear" },
	],
};

export default config;
