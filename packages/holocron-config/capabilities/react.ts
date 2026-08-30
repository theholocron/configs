import type { Capability } from "@theholocron/cli";

/**
 * Adds React/Storybook UI testing and browser runtime config.
 * Contributes: secrets provider, browser runtime property, Storybook + interaction
 * test jobs, audit with Knip + Lighthouse, and UI required checks.
 * Requires: node, typecheck
 */
export function react(): Capability {
	return {
		id: "react",
		requires: ["node", "typecheck"],
		providers: { secrets: "github" },
		repo: {
			properties: { runtime_environment: "browser", uses_external_packages: false },
		},
		workflows: [
			{
				name: "audit",
				with: {
					"run-knip": true,
					"run-performance": true,
					"lighthouse-config": "lighthouse.config.cjs",
				},
			},
			{
				name: "test",
				with: { "run-unit": false, "run-storybook": true, "run-interaction": true },
			},
		],
		requiredChecks: ["Storybook Publish", "UI Review", "UI Tests", "lhci/url/"],
	};
}
