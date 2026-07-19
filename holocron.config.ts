import { defineConfig } from "@theholocron/cli";
import type { HolocronConfig } from "@theholocron/cli";
import { theholocronNode } from "@theholocron/holocron-config";

const defaults = theholocronNode();
export default defineConfig({
	project: {
		name: "configs",
		description:
			"Shared configuration packages for the theholocron organization.",
		repo: "theholocron/configs",
		repoPolicy: defaults.repoPolicy,
		workflows: [
			...defaults.workflows,
			{ name: "release", with: { "run-build": true } },
		],
	},
	providers: defaults.providers,
} satisfies HolocronConfig);
