import type { Capability } from "@theholocron/cli";

/**
 * Adds a documentation site deployed to Cloudflare Pages with PR previews.
 * Sets org/domain, wires Cloudflare + DNS providers, and adds codecov
 * required checks (enabled for all docs repos).
 * Requires: node
 */
export function docs(): Capability {
	return {
		id: "docs",
		requires: ["node"],
		org: "theholocron",
		domain: "theholocron.dev",
		docs: { build: "workflow", https: true },
		providers: {
			deployment: ["cloudflare", { accountId: "9c558af98664d13fc89b7e0a0d93d5a8" }],
			dns: "cloudflare",
		},
		workflows: [{ name: "deploy", with: { docs: true, preview: true } }],
		requiredChecks: ["codecov/patch", "codecov/project"],
	};
}
