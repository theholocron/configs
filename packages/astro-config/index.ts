import { relative } from "node:path";
import { fileURLToPath } from "node:url";

import starlight from "@astrojs/starlight";
import { docsTheme } from "@theholocron/docs-theme";
import { defineConfig } from "astro/config";

interface SidebarGroup {
	label: string;
	items: unknown[];
}

export interface DocsConfig {
	slug: string;
	name: string;
	sidebar: Array<{ label: string } & ({ slug: string } | { items: unknown[] })>;
}

export interface DefineDocsConfigOptions {
	sidebarLabel?: string;
}

export function defineDocsConfig(
	docsConfig: DocsConfig,
	importMetaUrl: string,
	options: DefineDocsConfigOptions = {},
) {
	const docsDir = fileURLToPath(new URL(".", importMetaUrl));
	const contentDir = fileURLToPath(
		new URL(`../packages/${docsConfig.slug}-docs/content`, importMetaUrl),
	);
	const contentRelDir = relative(docsDir, contentDir);

	const secondItem = docsConfig.sidebar[1] as SidebarGroup | undefined;
	const defaultLabel =
		secondItem !== undefined && "items" in secondItem ? secondItem.label : "Contents";
	const sidebarLabel = options.sidebarLabel ?? defaultLabel;

	return defineConfig({
		site: "https://theholocron.github.io",
		base: `/${docsConfig.slug}`,
		integrations: [
			starlight({
				title: docsConfig.name,
				plugins: [docsTheme()],
				social: [
					{
						icon: "github",
						label: "GitHub",
						href: `https://github.com/theholocron/${docsConfig.slug}`,
					},
				],
				sidebar: [
					{ label: "Overview", slug: "" },
					{
						label: sidebarLabel,
						items: [{ autogenerate: { directory: contentRelDir } }],
					},
				],
			}),
		],
	});
}
