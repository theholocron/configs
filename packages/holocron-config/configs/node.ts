import type { HolocronConfig, RepoConfig } from "@theholocron/cli";

export interface HolocronPreset {
	providers: HolocronConfig["providers"];
	repo: Omit<RepoConfig, "name" | "requiredChecks">;
	workflows: NonNullable<HolocronConfig["workflows"]>;
}

/**
 * Shared defaults for theholocron Node.js repositories.
 * Spread the returned fragments into `defineConfig()` — only add what's unique per repo.
 *
 * @example
 * const { repo, workflows, providers } = node();
 * export default defineConfig({
 *   name: "my-repo",
 *   repo: { name: "theholocron/my-repo", topics: ["typescript"], ...repo },
 *   workflows: [...workflows, { name: "release", with: { "run-build": true } }],
 *   providers,
 * });
 */
export function node(): HolocronPreset {
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
		repo: {
			protection: "strict",
			properties: {
				lifecycle: "active",
				open_source: true,
				runtime_environment: "node",
				uses_external_packages: true,
			},
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
			"bookkeeping",
		],
	};
}
