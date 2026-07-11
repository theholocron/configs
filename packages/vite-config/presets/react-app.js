import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mergeConfig } from "vite";

function packageName() {
	try {
		return JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf-8")).name ?? "unknown";
	} catch {
		return "unknown";
	}
}

/**
 * Vite preset for React single-page applications.
 * Wires up @vitejs/plugin-react; accepts a vite-tsconfig-paths instance
 * via options.plugins if tsconfig path aliases are needed.
 * Uploads bundle stats to Codecov when CODECOV_TOKEN is set.
 *
 * @param {import('vite').UserConfig} [overrides={}]
 * @returns {Promise<import('vite').UserConfig>}
 */
export async function reactApp(overrides = {}) {
	const { default: react } = await import("@vitejs/plugin-react");

	const plugins = [react()];
	try {
		const { codecovVitePlugin } = await import("@codecov/vite-plugin");
		plugins.push(
			codecovVitePlugin({
				enableBundleAnalysis: !!process.env.CODECOV_TOKEN,
				bundleName: packageName(),
				uploadToken: process.env.CODECOV_TOKEN,
			}),
		);
	} catch {
		// @codecov/vite-plugin not installed — bundle analysis skipped
	}

	return mergeConfig(
		{
			plugins,
			build: {
				sourcemap: true,
			},
		},
		overrides,
	);
}
