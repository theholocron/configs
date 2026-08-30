import { compose } from "@theholocron/cli";
import type { ComposedPreset } from "@theholocron/cli";

import { node } from "../capabilities/node.js";
import { nextjs as nextjsCapability } from "../capabilities/nextjs.js";
import { typecheck } from "../capabilities/typecheck.js";

export type { NextjsOptions } from "../capabilities/nextjs.js";

/**
 * Preset for single-package Next.js application repos. Includes Vercel
 * deployment, Lighthouse audit, Storybook + interaction + user-flow tests,
 * and the Conclusion required checks.
 *
 * @example
 * const preset = nextjs({ test: { "wait-on-url": "http://localhost:3000", "run-chromatic": true } });
 * export default defineConfig({
 *   ...preset,
 *   repo: { ...preset.repo, name: "theholocron/my-app", topics: ["nextjs"] },
 *   workflows: [
 *     ...preset.workflows,
 *     "sync",
 *     { name: "deploy", with: { docs: true, storybook: [{ name: "" }] } },
 *   ],
 * });
 */
export function nextjs(options?: import("../capabilities/nextjs.js").NextjsOptions): ComposedPreset {
	return compose(node(), typecheck(), ...nextjsCapability(options));
}
