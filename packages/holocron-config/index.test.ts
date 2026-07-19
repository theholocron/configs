import { describe, expect, it } from "vitest";
import { theholocronNode } from "./index.js";

describe("theholocronNode()", () => {
	describe("providers", () => {
		it("uses github for source and ci", () => {
			const { providers } = theholocronNode();
			expect(providers.source).toBe("github");
			expect(providers.ci).toBe("github");
		});

		it("configures github issues with status labels", () => {
			const { providers } = theholocronNode();
			expect(providers.issues).toMatchObject([
				"github",
				{
					labels: {
						inProgress: "status:in-progress",
						inReview: "status:in-review",
					},
				},
			]);
		});
	});

	describe("repo", () => {
		it("sets strict protection", () => {
			const { repo } = theholocronNode();
			expect(repo.protection).toBe("strict");
		});

		it("sets active node properties", () => {
			const { repo } = theholocronNode();
			expect(repo.properties).toMatchObject({
				lifecycle: "active",
				open_source: true,
				runtime_environment: "node",
				uses_external_packages: true,
			});
		});
	});

	describe("workflows", () => {
		it("includes the baseline workflow set", () => {
			const { workflows } = theholocronNode();
			const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
			for (const expected of [
				"lint",
				"test",
				"typecheck",
				"codeql",
				"review",
				"stale",
				"greetings",
				"dependencies",
				"bookkeeping-pr",
			]) {
				expect(names).toContain(expected);
			}
		});

		it("does not include release (stays repo-specific)", () => {
			const { workflows } = theholocronNode();
			const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
			expect(names).not.toContain("release");
		});
	});
});
