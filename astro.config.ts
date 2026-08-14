import starlight from "@astrojs/starlight";
import { defineConfig } from "@theholocron/astro-config";
import { docsTheme } from "@theholocron/docs-theme";

export default defineConfig({
	docs: {
		name: "Configs",
		github: "configs",
		sidebar: [
			{ label: "Overview", slug: "" },
			{
				label: "Packages",
				items: [
					{ label: "Astro", slug: "astro-config" },
					{ label: "Browserslist", slug: "browserslist-config" },
					{ label: "CommitLint", slug: "commitlint-config" },
					{ label: "ESLint", slug: "eslint-config" },
					{ label: "Holocron", slug: "holocron-config" },
					{ label: "Lint Staged", slug: "lint-staged-config" },
					{ label: "Prettier", slug: "prettier-config" },
					{ label: "Semantic Release", slug: "semantic-release-config" },
					{ label: "Storybook", slug: "storybook-config" },
					{ label: "Stylelint", slug: "stylelint-config" },
					{ label: "TSConfig", slug: "tsconfig" },
					{ label: "tsdown", slug: "tsdown-config" },
					{ label: "Vite", slug: "vite-config" },
					{ label: "Vitest", slug: "vitest-config" },
				],
			},
		],
	},
	starlight,
	docsTheme,
	srcDir: "./docs/src",
	outDir: "./docs/dist",
	publicDir: "./docs/public",
});
