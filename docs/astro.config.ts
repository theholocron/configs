import starlight from "@astrojs/starlight";
import { defineConfig } from "@theholocron/astro-config";
import { docsTheme } from "@theholocron/docs-theme";
import configsConfig from "@theholocron/configs-docs";

export default defineConfig({
	docs: configsConfig,
	importMetaUrl: import.meta.url,
	starlight,
	docsTheme,
});
