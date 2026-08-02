import configsConfig from "@theholocron/configs-docs";
import { createDocsCollections } from "@theholocron/docs-theme/content";

export const collections = createDocsCollections(
	configsConfig,
	import.meta.url,
);
