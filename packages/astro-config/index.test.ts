import { describe, expect, it, vi } from "vitest";

vi.mock("astro/config", () => ({
	defineConfig: vi.fn((config: unknown) => config),
}));
vi.mock("@astrojs/starlight", () => ({
	default: vi.fn((config: unknown) => ({ name: "starlight", config })),
}));
vi.mock("@theholocron/docs-theme", () => ({
	docsTheme: vi.fn(() => ({ name: "@theholocron/docs-theme" })),
}));

import { defineDocsConfig } from "./index.js";

const mockConfig = {
	slug: "clients",
	name: "Clients",
	sidebar: [
		{ label: "Overview", slug: "clients" },
		{ label: "Packages", items: [] },
	],
};

describe("defineDocsConfig", () => {
	it("sets base from the config slug", () => {
		const config = defineDocsConfig(mockConfig, import.meta.url) as { base: string };
		expect(config.base).toBe("/clients");
	});

	it("derives sidebar label from sidebar[1].label when it is a group", () => {
		const config = defineDocsConfig(mockConfig, import.meta.url) as {
			integrations: Array<{ config: { sidebar: Array<{ label: string }> } }>;
		};
		const sidebar = config.integrations[0].config.sidebar;
		expect(sidebar[1].label).toBe("Packages");
	});

	it("accepts a sidebarLabel override", () => {
		const config = defineDocsConfig(mockConfig, import.meta.url, {
			sidebarLabel: "Reference",
		}) as {
			integrations: Array<{ config: { sidebar: Array<{ label: string }> } }>;
		};
		const sidebar = config.integrations[0].config.sidebar;
		expect(sidebar[1].label).toBe("Reference");
	});

	it("falls back to 'Contents' when sidebar[1] is a link not a group", () => {
		const linkConfig = {
			...mockConfig,
			sidebar: [
				{ label: "Overview", slug: "clients" },
				{ label: "Getting Started", slug: "clients/start" },
			],
		};
		const config = defineDocsConfig(linkConfig, import.meta.url) as {
			integrations: Array<{ config: { sidebar: Array<{ label: string }> } }>;
		};
		const sidebar = config.integrations[0].config.sidebar;
		expect(sidebar[1].label).toBe("Contents");
	});
});
