import { defineConfig } from "@theholocron/cli";
import type { HolocronConfig } from "@theholocron/cli";

export default defineConfig({
	project: {
		name: "configs",
		description:
			"Shared configuration packages for the theholocron organization.",
		repo: {
			name: "theholocron/configs",
			protection: "strict",
			topics: [
				"browserslist-config",
				"bundlewatch-config",
				"commitlint-config",
				"developer-tools",
				"eslint-config",
				"lint-staged-config",
				"nodejs",
				"prettier-config",
				"semantic-release-config",
				"shareable-configs",
				"storybook-config",
				"stylelint-config",
				"tsconfig",
				"tsdown-config",
				"vite-config",
				"vitest-config",
			],
			properties: {
				lifecycle: "active",
				open_source: true,
				runtime_environment: "node",
				uses_external_packages: true,
			},
		},
		workflows: [
			"lint",
			"codeql",
			"review",
			{ name: "release", with: { "run-build": true } },
			"stale",
			"greetings",
			"dependencies",
			"bookkeeping-pr",
		],
	},
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
} satisfies HolocronConfig);
