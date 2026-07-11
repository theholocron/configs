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
 * Vite preset for Node.js CLI tools and server apps.
 * Targets Node 22, outputs a single ESM bundle, no browser polyfills.
 * Uploads bundle stats to Codecov when CODECOV_TOKEN is set.
 *
 * @param {object} options
 * @param {string} [options.entry='src/index.ts'] Application entry point
 * @param {import('vite').UserConfig} [options.overrides={}] Merged last
 * @returns {Promise<import('vite').UserConfig>}
 */
export async function nodeApp({ entry = "src/index.ts", overrides = {} } = {}) {
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
				target: "node22",
				lib: {
					entry,
					formats: ["es"],
					fileName: () => "index.mjs",
				},
				sourcemap: true,
				rollupOptions: {
					external: [/^node:/],
				},
			},
		},
		overrides,
	);
}
