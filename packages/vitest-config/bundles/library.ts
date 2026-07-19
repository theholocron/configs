import { defineConfig } from "vitest/config";
import { node } from "../presets/node.js";

export function library({
	...rest
}: {
	[key: string]: unknown;
} = {}) {
	const base = node(rest);

	return {
		...base,
		test: {
			...base.test,
			coverage: {
				enabled: true,
				provider: "v8",
				reporter: ["lcov", "text"],
				include: ["src/**/*.ts"],
				exclude: [
					"src/**/__tests__/**",
					"src/**/*.{test,spec}.ts",
					"src/index.ts",
					"**/node_modules/**",
					"**/dist/**",
				],
			},
		},
	};
}

/** Ready-to-use config for packages that need no customisation. */
// defineConfig doesn't list coverage in ProjectConfig for v4 workspace configs —
// cast through unknown so the inferred return type passes the overload check.
export default defineConfig(library() as never);
