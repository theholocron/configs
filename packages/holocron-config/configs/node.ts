import { compose } from "@theholocron/cli";
import type { ComposedPreset } from "@theholocron/cli";

import { node as nodeCapability } from "../capabilities/node.js";

export type { ComposedPreset as HolocronPreset };

/**
 * Base preset for theholocron Node.js repositories.
 * Spread the returned fragments into `defineConfig()`.
 *
 * @example
 * const preset = node();
 * export default defineConfig({
 *   ...preset,
 *   repo: { ...preset.repo, name: "theholocron/my-lib" },
 *   workflows: [...preset.workflows, { name: "release", with: { "run-build": true } }],
 * });
 */
export function node(): ComposedPreset {
	return compose(nodeCapability());
}
