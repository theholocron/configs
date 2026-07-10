import { mergeConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite preset for React single-page applications.
 * Wires up @vitejs/plugin-react; accepts a vite-tsconfig-paths instance
 * via options.plugins if tsconfig path aliases are needed.
 *
 * @param {import('vite').UserConfig} [overrides={}]
 * @returns {import('vite').UserConfig}
 */
export function reactApp(overrides = {}) {
	return mergeConfig(
		{
			plugins: [react()],
			build: {
				sourcemap: true,
			},
		},
		overrides,
	);
}
