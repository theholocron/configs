import type { HolocronConfig } from "@theholocron/cli";
import { node } from "./node.js";
import type { HolocronPreset } from "./node.js";

const REQUIRED_CHECKS = [
	"Lint / Conclusion",
	"Test / Conclusion",
	"Typecheck / Conclusion",
	"audit / Conclusion",
	"codecov/patch",
	"codecov/project",
];

const REQUIRED_CHECKS_SITE = ["Lint / Conclusion", "Test / Conclusion", "codecov/patch", "codecov/project"];

export interface NodeDocsPreset extends HolocronPreset {
	org: string;
	domain: string;
	docs: NonNullable<HolocronConfig["docs"]>;
	repo: HolocronPreset["repo"] & { requiredChecks: string[] };
}

export type NodeDocsSitePreset = NodeDocsPreset;

/**
 * Extends `node()` for repos that publish a documentation site and deploy
 * previews via Cloudflare Pages. Adds org/domain, Cloudflare providers,
 * deploy+preview workflow, and the Conclusion required checks.
 *
 * @example
 * const { repo, workflows, providers, org, domain, docs } = nodeDocs();
 * export default defineConfig({
 *   description: "...",
 *   homepage: "https://docs.theholocron.dev/my-lib/",
 *   org,
 *   domain,
 *   docs,
 *   repo: {
 *     ...repo,
 *     name: "theholocron/my-lib",
 *     topics: ["typescript"],
 *     requiredChecks: [...repo.requiredChecks, "codecov/patch/my-pkg"],
 *   },
 *   workflows: [...workflows, "audit", { name: "release", with: { "run-build": true } }, "sync"],
 *   providers: { ...providers, secrets: "github" },
 * });
 */
export function nodeDocs(): NodeDocsPreset {
	const base = node();
	return {
		...base,
		org: "theholocron",
		domain: "theholocron.dev",
		docs: { build: "workflow", https: true },
		providers: {
			...base.providers,
			deployment: ["cloudflare", { accountId: "9c558af98664d13fc89b7e0a0d93d5a8" }],
			dns: "cloudflare",
		},
		repo: {
			...base.repo,
			requiredChecks: REQUIRED_CHECKS,
		},
		workflows: [...base.workflows, { name: "deploy", with: { docs: true, preview: true } }],
	};
}

/**
 * Variant of `nodeDocs()` for repos that are documentation-only sites with no
 * TypeScript source to check. Identical to `nodeDocs()` except typecheck is
 * not included — neither the workflow nor the required CI check.
 *
 * Use this for repos like `skills` or `themes` where the site content is
 * the primary artifact and there is no TS library to compile.
 *
 * @example
 * const { repo, workflows, providers, org, domain, docs } = nodeDocsSite();
 * export default defineConfig({
 *   description: "...",
 *   org,
 *   domain,
 *   docs,
 *   repo: { ...repo, name: "theholocron/my-site" },
 *   workflows: [...workflows, { name: "release", with: { "run-build": false } }, "sync"],
 *   providers: { ...providers, secrets: "github" },
 * });
 */
export function nodeDocsSite(): NodeDocsSitePreset {
	const base = node();
	return {
		...base,
		org: "theholocron",
		domain: "theholocron.dev",
		docs: { build: "workflow", https: true },
		providers: {
			...base.providers,
			deployment: ["cloudflare", { accountId: "9c558af98664d13fc89b7e0a0d93d5a8" }],
			dns: "cloudflare",
		},
		repo: {
			...base.repo,
			requiredChecks: REQUIRED_CHECKS_SITE,
		},
		workflows: [
			"lint",
			"test",
			"codeql",
			"review",
			"stale",
			"greetings",
			"dependencies",
			"bookkeeping",
			{ name: "deploy", with: { docs: true, preview: true } },
		],
	};
}
