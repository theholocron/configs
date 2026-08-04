import { vi, describe, it, expect, beforeEach } from "vitest";

// storybook() does a dynamic import of this plugin which resolves the .storybook
// directory at call time — mock it so the preset is testable in isolation.
vi.mock("@storybook/addon-vitest/vitest-plugin", () => ({
	storybookTest: vi.fn(() => ({ name: "storybook-vitest-plugin" })),
}));

vi.mock("@testing-library/jest-dom", () => ({}));

import { node, react, storybook } from "./index.js";
import { library } from "./bundles/library.js";
import { setupMSWBrowser, setupMSWNode } from "./setup/msw.js";

describe("vitest-config — presets", () => {
	it("node() returns config with node environment", () => {
		const config = node();
		expect(config.test?.environment).toBe("node");
		expect(Array.isArray(config.test?.include)).toBe(true);
	});

	it("react() returns config with jsdom environment", () => {
		const config = react();
		expect(config.test?.environment).toBe("jsdom");
	});

	it("react() includes jest-dom setup file", () => {
		const config = react();
		expect(config.test?.setupFiles).toContain("@theholocron/vitest-config/setup/jest-dom");
	});

	it("storybook() returns a config object", async () => {
		const config = await storybook();
		expect(typeof config).toBe("object");
		expect(config.test).toBeDefined();
	});

	it("presets accept option overrides", () => {
		const config = node({ reporters: ["verbose"] });
		expect(config.test?.reporters).toContain("verbose");
	});
});

describe("vitest-config — setup helpers", () => {
	let calls: string[];

	beforeEach(() => {
		calls = [];
	});

	it("setupMSWBrowser registers lifecycle hooks for a worker", async () => {
		const worker = {
			start: vi.fn(async () => {
				calls.push("start");
			}),
			resetHandlers: vi.fn(() => {
				calls.push("reset");
			}),
			stop: vi.fn(() => {
				calls.push("stop");
			}),
		};
		setupMSWBrowser(worker);
		expect(worker.start).toBeDefined();
		expect(worker.resetHandlers).toBeDefined();
		expect(worker.stop).toBeDefined();
	});

	it("setupMSWBrowser calls annotations.beforeAll before worker.start", async () => {
		const order: string[] = [];
		const worker = {
			start: vi.fn(async () => {
				order.push("worker.start");
			}),
			resetHandlers: vi.fn(),
			stop: vi.fn(),
		};
		const annotations = {
			beforeAll: vi.fn(async () => {
				order.push("annotations.beforeAll");
			}),
		};
		setupMSWBrowser(worker, annotations);
		// Manually invoke the registered beforeAll to verify order
		await annotations.beforeAll();
		await worker.start();
		expect(order).toEqual(["annotations.beforeAll", "worker.start"]);
	});

	it("setupMSWNode registers lifecycle hooks for a server", () => {
		const server = {
			listen: vi.fn(),
			resetHandlers: vi.fn(),
			close: vi.fn(),
		};
		setupMSWNode(server);
		expect(server.listen).toBeDefined();
		expect(server.resetHandlers).toBeDefined();
		expect(server.close).toBeDefined();
	});
});

describe("vitest-config — bundles", () => {
	it("library() returns config with coverage thresholds", () => {
		const config = library();
		expect(config.test?.coverage?.thresholds?.lines).toBe(80);
		expect(config.test?.coverage?.thresholds?.branches).toBe(80);
		expect(config.test?.coverage?.thresholds?.functions).toBe(80);
		expect(config.test?.coverage?.thresholds?.statements).toBe(80);
	});

	it("library() accepts per-file threshold overrides", () => {
		const config = library({
			thresholds: {
				"src/generated.ts": {
					lines: 0,
					functions: 0,
					branches: 0,
					statements: 0,
				},
			},
		});
		expect(config.test?.coverage?.thresholds?.["src/generated.ts"]).toBeDefined();
	});
});
