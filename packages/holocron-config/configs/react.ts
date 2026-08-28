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
 * Preset for single-package React/Vite application repos. Identical to
 * `nextjs()` except: no Vercel deployment (deploy target is per-repo) and
 * no `run-user-flow` (Cypress not assumed). Per-repo still provides: chromatic
 * project config, storybook deploy config, sync workflow.
 *
 * @example
 * const { repo, workflows, providers, org, domain } = react();
 * export default defineConfig({
 *   org,
 *   domain,
 *   repo: { ...repo, name: "theholocron/my-app", topics: ["react", "vite"] },
 *   workflows: [
 *     ...workflows,
 *     { name: "test", with: { "run-chromatic": { projects: [{ tokenName: "default", workingDir: ".", buildScript: "build:storybook:chromatic" }] } } },
 *     "sync",
 *     { name: "deploy", with: { docs: true, storybook: [{ name: "" }] } },
 *   ],
 *   providers,
 * });
 */
export function react(): HolocronPreset & { org: string; domain: string } {
	const base = node();
	return {
		...base,
		org: "theholocron",
		domain: "theholocron.dev",
		providers: {
			...base.providers,
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
				},
			},
		],
	};
}
