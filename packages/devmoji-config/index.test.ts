import { describe, expect, it } from "vitest";
import config, { type DevmojiConfig } from "./index.js";

describe("devmoji-config", () => {
	it("exports a plain object", () => {
		expect(typeof config).toBe("object");
		expect(config).not.toBeNull();
	});

	it("has no extra types by default — all theholocron types are devmoji built-ins", () => {
		expect(config.types).toBeUndefined();
	});

	it("has no custom devmoji entries by default", () => {
		expect(config.devmoji).toBeUndefined();
	});

	it("satisfies the DevmojiConfig interface", () => {
		const typed: DevmojiConfig = config;
		expect(typed).toBeDefined();
	});
});
