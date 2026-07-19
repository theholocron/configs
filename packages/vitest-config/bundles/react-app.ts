import { react } from "../presets/react.js";

/**
 * Vitest bundle for React applications.
 *
 * @param {import('vitest/config').UserProjectConfig['test']} [options]
 * @returns {import('vitest/config').UserProjectConfig}
 */
export function reactApp(options = {}) {
	const base = react(options);

	return {
		...base,
		test: {
			...base.test,
			coverage: {
				enabled: true,
				provider: "v8",
				reporter: ["lcov", "text"],
				include: ["src/**"],
				exclude: [
					"**/*.{test,spec}.*",
					"**/*.{story,stories}.*",
					"**/node_modules/**",
					"**/dist/**",
				],
			},
		},
	};
}
