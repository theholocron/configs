import { node } from "./node.js";
import type { HolocronPreset } from "./node.js";

const REQUIRED_CHECKS = [
	"Lint / Conclusion",
	"Test / Conclusion",
	"Typecheck / Conclusion",
	"audit / Conclusion",
	"codecov/patch",
	"codecov/project",
	"Storybook Publish",
	"UI Review",
	"UI Tests",
	"lhci/url/",
];

/**
 * Preset for single-package Next.js application repos. Includes Vercel
 * deployment, Lighthouse audit, Storybook + interaction + user-flow tests,
 * and the Conclusion required checks. Per-repo still provides: chromatic
 * project config, wait-on-url, storybook deploy config, sync workflow.
 *
 * @example
 * const { repo, workflows, providers, org, domain } = nextjs();
 * export default defineConfig({
 *   org,
 *   domain,
 *   repo: { ...repo, name: "theholocron/my-app", topics: ["nextjs"] },
 *   workflows: [
 *     ...workflows,
 *     { name: "test", with: { "run-chromatic": true, "wait-on-url": "http://localhost:3000" } },
 *     "sync",
 *     { name: "deploy", with: { docs: true, storybook: [{ name: "" }] } },
 *   ],
 *   providers,
 * });
 */
export function nextjs(): HolocronPreset & { org: string; domain: string } {
	const base = node();
	return {
		...base,
		org: "theholocron",
		domain: "theholocron.dev",
		providers: {
			...base.providers,
			deployment: "vercel",
			secrets: "github",
		},
		repo: {
			...base.repo,
			properties: {
				...base.repo.properties,
				runtime_environment: "browser",
				uses_external_packages: false,
			},
			requiredChecks: REQUIRED_CHECKS,
		},
		workflows: [
			...base.workflows,
			{
				name: "audit",
				with: { "run-knip": true, "run-performance": true, "lighthouse-config": "lighthouse.config.cjs" },
			},
			{
				name: "test",
				with: {
					"run-unit": false,
					"run-storybook": true,
					"run-interaction": true,
					"run-user-flow": true,
				},
			},
		],
	};
}
