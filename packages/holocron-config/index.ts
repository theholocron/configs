import type { HolocronConfig } from "@theholocron/cli";

interface RepoPreset {
	protection: "balanced" | "strict" | "none";
	properties: {
		lifecycle?: "active" | "experimental" | "deprecated";
		open_source?: boolean;
		runtime_environment?: "node" | "browser" | "universal" | "none";
		uses_external_packages?: boolean;
	};
}

export interface HolocronPreset {
	providers: HolocronConfig["providers"];
	repo: RepoPreset;
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
 *     repo: {
 *       name: "theholocron/my-repo",
 *       topics: ["typescript"],
 *       ...defaults.repo,
 *     },
 *     workflows: [...defaults.workflows, { name: "release", with: { "run-build": true } }],
 *   },
 *   providers: defaults.providers,
 * });
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
			"bookkeeping-pr",
		],
	};
}
