import { compose } from "@theholocron/cli";
import type { ComposedPreset } from "@theholocron/cli";

import { audit } from "../capabilities/audit.js";
import { docs } from "../capabilities/docs.js";
import { node } from "../capabilities/node.js";
import { typecheck } from "../capabilities/typecheck.js";

export type NodeDocsPreset = ComposedPreset;
export type NodeDocsSitePreset = ComposedPreset;

/**
 * Preset for theholocron repos that are TypeScript libraries AND publish a
 * documentation site (e.g. configs, utils, holocron). Includes typecheck and
 * audit in addition to the docs deploy.
 *
 * For repos that are docs-only sites without TypeScript source to check,
 * use nodeDocsSite() instead.
 *
 * @example
 * const preset = nodeDocs();
 * export default defineConfig({
 *   ...preset,
 *   description: "...",
 *   homepage: "https://docs.theholocron.dev/my-lib/",
 *   repo: { ...preset.repo, name: "theholocron/my-lib", topics: ["typescript"] },
 *   workflows: [...preset.workflows, "audit", { name: "release", with: { "run-build": true } }, "sync"],
 *   providers: { ...preset.providers, secrets: "github" },
 * });
 */
export function nodeDocs(): NodeDocsPreset {
	return compose(node(), typecheck(), docs(), audit());
}

/**
 * Preset for theholocron repos that are documentation-only sites with no
 * TypeScript source to check (e.g. skills, themes). Identical to nodeDocs()
 * except typecheck and audit are not included.
 *
 * @example
 * const preset = nodeDocsSite();
 * export default defineConfig({
 *   ...preset,
 *   description: "...",
 *   repo: { ...preset.repo, name: "theholocron/my-site" },
 *   workflows: [...preset.workflows, { name: "release", with: { "run-build": false } }, "sync"],
 *   providers: { ...preset.providers, secrets: "github" },
 * });
 */
export function nodeDocsSite(): NodeDocsSitePreset {
	return compose(node(), docs());
}
