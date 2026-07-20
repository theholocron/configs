import { describe, expect, it } from "vitest";
import { node } from "./index.js";

describe("node()", () => {
	describe("repo", () => {
		it("sets strict protection", () => {
			const { repo } = node();
			expect(repo.protection).toBe("strict");
		});
	});

	describe("workflows", () => {
		it("includes the baseline workflow set", () => {
			const { workflows } = node();
			const names = workflows.map((w) =>
				typeof w === "string" ? w : w.name,
			);
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
			const { workflows } = node();
			const names = workflows.map((w) =>
				typeof w === "string" ? w : w.name,
			);
			expect(names).not.toContain("release");
		});
	});

	describe("providers", () => {
		it("uses github for source and ci", () => {
			const { providers } = node();
			expect(providers.source).toBe("github");
			expect(providers.ci).toBe("github");
		});

		it("configures github issues with status labels", () => {
			const { providers } = node();
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
});
