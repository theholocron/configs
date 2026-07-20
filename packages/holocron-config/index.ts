import type { HolocronConfig } from "@theholocron/cli";

export interface HolocronPreset {
	repo: Pick<NonNullable<HolocronConfig["repo"]>, "protection">;
	workflows: NonNullable<HolocronConfig["workflows"]>;
	providers: HolocronConfig["providers"];
}

/**
 * Shared defaults for theholocron Node.js repositories.
 * Spread the returned fragments into `defineConfig()` — only add what's unique per repo.
 *
 * @example
 * const { repo, workflows, providers } = node();
 * export default defineConfig({
 *   name: "my-repo",
 *   repo: { name: "theholocron/my-repo", topics: ["nodejs"], ...repo },
 *   workflows: [...workflows, { name: "release", with: { "run-build": true } }],
 *   providers: { ...providers },
 * } satisfies HolocronConfig);
 */
export function node(): HolocronPreset {
	return {
		repo: {
			protection: "strict",
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
	};
}
