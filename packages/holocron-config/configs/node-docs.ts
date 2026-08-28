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

export interface NodeDocsPreset extends HolocronPreset {
	org: string;
	domain: string;
	docs: NonNullable<HolocronConfig["docs"]>;
	repo: HolocronPreset["repo"] & { requiredChecks: string[] };
}

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
			deployment: "cloudflare",
			dns: "cloudflare",
		},
		repo: {
			...base.repo,
			requiredChecks: REQUIRED_CHECKS,
		},
		workflows: [
			...base.workflows,
			{ name: "deploy", with: { docs: true, preview: true } },
		],
	};
}
