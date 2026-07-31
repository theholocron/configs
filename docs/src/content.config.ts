import { fileURLToPath } from "node:url";

import { docsSchema } from "@astrojs/starlight/schema";
import configsConfig from "@theholocron/configs-docs";
import { createDocsLoader } from "@theholocron/docs-theme/loader";
import { defineCollection } from "astro:content";

const REPO_SLUG = configsConfig.slug;

function localSlug(configSlug: string): string {
	if (configSlug === REPO_SLUG) return "";
	if (configSlug.startsWith(`${REPO_SLUG}/`))
		return configSlug.slice(REPO_SLUG.length + 1);
	return configSlug;
}

export const collections = {
	docs: defineCollection({
		loader: createDocsLoader([
			{
				dir: fileURLToPath(
					new URL(
						"../../packages/configs-docs/content",
						import.meta.url,
					),
				),
				slug: localSlug(configsConfig.slug),
			},
		]),
		schema: docsSchema(),
	}),
};
