import type { HolocronPreset } from "./node.js";

/**
 * Extension that wraps any base preset with monorepo-specific overrides.
 * Not a standalone preset — always takes a base (e.g. `monorepo(nextjs())`).
 *
 * Overrides: `uses_external_packages: true` (workspaces pull in many deps).
 * Per-repo still provides: storybook-projects array, chromatic project
 * definitions, workspace-specific required checks.
 *
 * @example
 * const { repo, workflows, providers, org, domain } = monorepo(nextjs());
 * export default defineConfig({
 *   org,
 *   domain,
 *   repo: { ...repo, name: "theholocron/my-monorepo" },
 *   workflows: [
 *     ...workflows,
 *     { name: "test", with: { "run-chromatic": { projects: [{ tokenName: "WEB", workingDir: "apps/web" }] } } },
 *     "sync",
 *     { name: "deploy", with: { docs: true, "storybook-projects": [{ name: "web", workingDir: "apps/web" }] } },
 *   ],
 *   providers,
 * });
 */
export function monorepo<T extends HolocronPreset>(base: T): T {
	return {
		...base,
		repo: {
			...base.repo,
			properties: {
				...base.repo.properties,
				uses_external_packages: true,
			},
		},
	};
}
