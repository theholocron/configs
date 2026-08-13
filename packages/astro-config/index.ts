import type starlight from "@astrojs/starlight";
import type { docsTheme } from "@theholocron/docs-theme";
import { defineConfig as astroDefineConfig } from "astro/config";

export interface DocsConfig {
	name: string;
	github: string;
	sidebar: Array<{ label: string } & ({ slug: string } | { items: unknown[] })>;
}

export interface DocsConfigInput {
	docs: DocsConfig;
	starlight: typeof starlight;
	docsTheme: typeof docsTheme;
	srcDir?: string;
	outDir?: string;
	publicDir?: string;
}

export function defineConfig({ docs, starlight, docsTheme, srcDir, outDir, publicDir }: DocsConfigInput) {
	return astroDefineConfig({
		...(srcDir && { srcDir }),
		...(outDir && { outDir }),
		...(publicDir && { publicDir }),
		integrations: [
			starlight({
				title: docs.name,
				plugins: [docsTheme()],
				social: [
					{
						icon: "github",
						label: "GitHub",
						href: `https://github.com/theholocron/${docs.github}`,
					},
				],
				sidebar: docs.sidebar,
			}),
		],
	});
}
