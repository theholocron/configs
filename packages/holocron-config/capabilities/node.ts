import type { Capability } from "@theholocron/cli";

/**
 * Base capability for all theholocron Node.js repositories.
 * Contributes: GitHub source/CI/issues providers, strict branch protection,
 * and the standard workflow set (lint, test, codeql, review, stale, greetings,
 * dependencies, bookkeeping). Does NOT include typecheck — add that separately.
 */
export function node(): Capability {
	return {
		id: "node",
		providers: {
			source: "github",
			ci: "github",
			issues: [
				"github",
				{
					labels: {
						inProgress: "status:in-progress",
						inReview: "status:in-review",
					},
				},
			],
		},
		repo: {
			protection: "strict",
			properties: {
				lifecycle: "active",
				open_source: true,
				runtime_environment: "node",
				uses_external_packages: true,
			},
		},
		requiredChecks: ["Lint / Conclusion", "Test / Conclusion"],
		workflows: ["lint", "test", "codeql", "review", "stale", "greetings", "dependencies", "bookkeeping"],
	};
}
