import starlight from "@astrojs/starlight";
import { docsTheme } from "@theholocron/docs-theme";
import { defineConfig } from "@theholocron/astro-config";
import configsConfig from "@theholocron/configs-docs";

export default defineConfig({
	docs: configsConfig,
	importMetaUrl: import.meta.url,
	starlight,
	docsTheme,
});
