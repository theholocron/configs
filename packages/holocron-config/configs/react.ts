import { compose } from "@theholocron/cli";
import type { ComposedPreset } from "@theholocron/cli";

import { node } from "../capabilities/node.js";
import { react as reactCapability } from "../capabilities/react.js";
import type { ReactOptions } from "../capabilities/react.js";
import { typecheck } from "../capabilities/typecheck.js";

export type { ReactOptions };

/**
 * Preset for single-package React/Vite application repos. Includes Storybook,
 * interaction tests, Knip + Lighthouse audit, and UI required checks.
 *
 * Pass `test` overrides to merge repo-specific options (e.g. run-chromatic)
 * into the single test workflow entry so the sync tool sees one complete entry:
 *
 * @example
 * const preset = react({
 *   test: { "run-chromatic": { projects: [{ tokenName: "default", workingDir: "." }] } },
 * });
 * export default defineConfig({
 *   ...preset,
 *   repo: { ...preset.repo, name: "theholocron/my-app" },
 *   workflows: [...preset.workflows, "sync", { name: "deploy", with: { docs: true, storybook: [{ name: "" }] } }],
 * });
 */
export function react(options?: ReactOptions): ComposedPreset {
	return compose(node(), typecheck(), reactCapability(options));
}
