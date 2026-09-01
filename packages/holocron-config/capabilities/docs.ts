import type { Capability } from "@theholocron/cli";

import { CLOUDFLARE_ACCOUNT_ID } from "../constants.js";

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
			deployment: ["cloudflare", { accountId: CLOUDFLARE_ACCOUNT_ID }],
			dns: "cloudflare",
			workers: ["cloudflare", { accountId: CLOUDFLARE_ACCOUNT_ID }],
		},
		workflows: [{ name: "deploy", with: { docs: true, preview: true } }],
		requiredChecks: ["codecov/patch", "codecov/project"],
	};
}
