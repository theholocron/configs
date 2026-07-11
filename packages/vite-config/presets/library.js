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
 * Vite preset for publishable libraries.
 * Outputs ESM only; externalises React and react-dom by default.
 * Uploads bundle stats to Codecov when CODECOV_TOKEN is set.
 *
 * @param {object} options
 * @param {string} [options.entry='src/index.ts'] Library entry point
 * @param {string} [options.name] UMD global name (required for UMD builds)
 * @param {string[]} [options.external=[]] Additional peer deps to externalise
 * @param {import('vite').UserConfig} [options.overrides={}] Merged last
 * @returns {Promise<import('vite').UserConfig>}
 */
export async function library({ entry = "src/index.ts", name, external = [], overrides = {} } = {}) {
	const plugins = [];
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
				lib: {
					entry,
					name,
					formats: ["es"],
					fileName: () => "index.mjs",
				},
				rollupOptions: {
					external: ["react", "react-dom", ...external],
					output: {
						globals: {
							react: "React",
							"react-dom": "ReactDOM",
						},
					},
				},
				sourcemap: true,
			},
		},
		overrides,
	);
}
