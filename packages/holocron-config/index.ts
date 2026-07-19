import type { HolocronConfig } from "@theholocron/cli";

export interface HolocronPreset {
	providers: HolocronConfig["providers"];
	repoPolicy: NonNullable<HolocronConfig["project"]["repoPolicy"]>;
	workflows: NonNullable<HolocronConfig["project"]["workflows"]>;
}

/**
 * Shared defaults for theholocron Node.js repositories.
 * Spread the returned fragments into `defineConfig()` — only add what's unique per repo.
 *
 * @example
 * const defaults = theholocronNode();
 * export default defineConfig({
 *   project: {
 *     name: "my-repo",
 *     repo: "theholocron/my-repo",
 *     repoPolicy: defaults.repoPolicy,
 *     workflows: [...defaults.workflows, { name: "release", with: { "run-build": true } }],
 *   },
 *   providers: defaults.providers,
 * } satisfies HolocronConfig);
 */
export function theholocronNode(): HolocronPreset {
	return {
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
		repoPolicy: {
			preset: "strict",
		},
		workflows: [
			"lint",
			"test",
			"typecheck",
			"codeql",
			"review",
			"stale",
			"greetings",
			"dependencies",
			"bookkeeping-pr",
		],
	};
}
