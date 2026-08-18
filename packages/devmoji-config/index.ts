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
 * All standard commit types (feat, fix, chore, docs, ci, test, refactor, perf)
 * are covered by devmoji's built-in defaults — no overrides needed.
 *
 * Consuming repos reference this via `devmoji.config.cjs`:
 * ```js
 * const pkg = require('@theholocron/devmoji-config');
 * module.exports = pkg.default ?? pkg;
 * ```
 */
const config: DevmojiConfig = {};

export default config;
