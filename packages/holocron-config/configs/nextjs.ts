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

export interface NextjsOptions {
	/** Extra `with:` inputs merged into the `test` workflow entry (e.g. wait-on-url, run-chromatic). */
	test?: Record<string, unknown>;
}

/**
 * Preset for single-package Next.js application repos. Includes Vercel
 * deployment, Lighthouse audit, Storybook + interaction + user-flow tests,
 * and the Conclusion required checks.
 *
 * Pass `test` overrides to merge repo-specific options (e.g. `wait-on-url`,
 * `run-chromatic`) into the single test workflow entry so the sync tool sees
 * one complete entry rather than two conflicting ones.
 *
 * @example
 * const { repo, workflows, providers, org, domain } = nextjs({
 *   test: { "wait-on-url": "http://localhost:3000", "run-chromatic": true },
 * });
 * export default defineConfig({
 *   org,
 *   domain,
 *   repo: { ...repo, name: "theholocron/my-app", topics: ["nextjs"] },
 *   workflows: [
 *     ...workflows,
 *     "sync",
 *     { name: "deploy", with: { docs: true, storybook: [{ name: "" }] } },
 *   ],
 *   providers,
 * });
 */
export function nextjs(
	{ test: testOverrides = {} }: NextjsOptions = {}
): HolocronPreset & { org: string; domain: string } {
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
					...testOverrides,
				},
			},
		],
	};
}
