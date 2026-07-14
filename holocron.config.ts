import { defineConfig } from "@theholocron/cli";

export default defineConfig({
	project: {
		name: "configs",
		description:
			"Shared configuration packages for the theholocron organization.",
		repo: "theholocron/configs",
		repoPolicy: {
			preset: "strict",
		},
		workflows: [
			"lint",
			"codeql",
			"review",
			{ name: "release", with: { "run-build": false } },
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
});
