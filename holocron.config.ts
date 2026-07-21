import { defineConfig } from "@theholocron/cli";
import type { HolocronConfig } from "@theholocron/cli";
import { node } from "@theholocron/holocron-config";

const { repo, workflows, providers } = node();
export default defineConfig({
	description: "Shared configuration files.",
	repo: {
		topics: [
			"browserslist-config",
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
		...repo,
	},
	workflows: [...workflows, { name: "release", with: { "run-build": true } }],
	providers,
	agent: "claude",
	skills: ["git-safety", "pr-workflow", "commit-standards", "security-review", "holocron-skill-config"],
} satisfies HolocronConfig);
