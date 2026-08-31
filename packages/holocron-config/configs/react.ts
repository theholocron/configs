import { compose } from "@theholocron/cli";
import type { ComposedPreset } from "@theholocron/cli";

import { node } from "../capabilities/node.js";
import { react as reactCapability } from "../capabilities/react.js";
import { typecheck } from "../capabilities/typecheck.js";

/**
 * Preset for single-package React/Vite application repos. Includes Storybook,
 * interaction tests, Knip + Lighthouse audit, and UI required checks.
 * Does NOT include Vercel deployment or Cypress user-flow — add nextjs() for those.
 *
 * @example
 * const preset = react();
 * export default defineConfig({
 *   ...preset,
 *   repo: { ...preset.repo, name: "theholocron/my-app", topics: ["react", "vite"] },
 *   workflows: [
 *     ...preset.workflows,
 *     { name: "test", with: { "run-chromatic": { projects: [{ tokenName: "default", workingDir: "." }] } } },
 *     "sync",
 *     { name: "deploy", with: { docs: true, storybook: [{ name: "" }] } },
 *   ],
 * });
 */
export function react(): ComposedPreset {
	return compose(node(), typecheck(), reactCapability());
}
