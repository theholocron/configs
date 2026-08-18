import { describe, expect, it } from "vitest";
import config, { type DevmojiConfig } from "./index.js";

describe("devmoji-config", () => {
	it("exports a plain object", () => {
		expect(typeof config).toBe("object");
		expect(config).not.toBeNull();
	});

	it("includes lint as an extra accepted type", () => {
		expect(config.types).toContain("lint");
	});

	it("maps feat to boom emoji", () => {
		const feat = config.devmoji?.find((e) => e.code === "feat");
		expect(feat?.emoji).toBe("boom");
	});

	it("maps fail to poop emoji with a description", () => {
		const fail = config.devmoji?.find((e) => e.code === "fail");
		expect(fail?.emoji).toBe("poop");
		expect(fail?.description).toBeTruthy();
	});

	it("maps config to gear emoji via gitmoji wrench", () => {
		const cfg = config.devmoji?.find((e) => e.code === "config");
		expect(cfg?.gitmoji).toBe("wrench");
		expect(cfg?.emoji).toBe("gear");
	});

	it("satisfies the DevmojiConfig interface", () => {
		const typed: DevmojiConfig = config;
		expect(typed).toBeDefined();
	});
});
