import { describe, expect, it } from "vitest";
import { monorepo, nextjs, node, nodeDocs, react } from "./index.js";

describe("node()", () => {
	describe("repo", () => {
		it("sets strict protection", () => {
			const { repo } = node();
			expect(repo.protection).toBe("strict");
		});

		it("does not include requiredChecks", () => {
			const { repo } = node();
			expect(repo.requiredChecks).toBeUndefined();
		});
	});

	describe("workflows", () => {
		it("includes the baseline workflow set", () => {
			const { workflows } = node();
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
				"bookkeeping",
			]) {
				expect(names).toContain(expected);
			}
		});

		it("does not include release (stays repo-specific)", () => {
			const { workflows } = node();
			const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
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

describe("nodeDocs()", () => {
	describe("top-level fields", () => {
		it("sets org and domain", () => {
			const { org, domain } = nodeDocs();
			expect(org).toBe("theholocron");
			expect(domain).toBe("theholocron.dev");
		});

		it("sets docs config", () => {
			const { docs } = nodeDocs();
			expect(docs).toEqual({ build: "workflow", https: true });
		});
	});

	describe("providers", () => {
		it("adds cloudflare deployment with accountId and dns", () => {
			const { providers } = nodeDocs();
			expect(providers.deployment).toEqual(["cloudflare", { accountId: "9c558af98664d13fc89b7e0a0d93d5a8" }]);
			expect(providers.dns).toBe("cloudflare");
		});

		it("inherits github source and ci from node()", () => {
			const { providers } = nodeDocs();
			expect(providers.source).toBe("github");
			expect(providers.ci).toBe("github");
		});
	});

	describe("repo", () => {
		it("includes Conclusion required checks", () => {
			const { repo } = nodeDocs();
			expect(repo.requiredChecks).toContain("Lint / Conclusion");
			expect(repo.requiredChecks).toContain("Test / Conclusion");
			expect(repo.requiredChecks).toContain("Typecheck / Conclusion");
			expect(repo.requiredChecks).toContain("audit / Conclusion");
		});

		it("includes cross-repo codecov checks", () => {
			const { repo } = nodeDocs();
			expect(repo.requiredChecks).toContain("codecov/patch");
			expect(repo.requiredChecks).toContain("codecov/project");
		});
	});

	describe("workflows", () => {
		it("includes all node() baseline workflows", () => {
			const { workflows } = nodeDocs();
			const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
			expect(names).toContain("lint");
			expect(names).toContain("test");
			expect(names).toContain("typecheck");
		});

		it("includes deploy with docs and preview", () => {
			const { workflows } = nodeDocs();
			const deploy = workflows.find((w) => typeof w !== "string" && w.name === "deploy");
			expect(deploy).toMatchObject({ name: "deploy", with: { docs: true, preview: true } });
		});

		it("does not include audit or release (stay repo-specific)", () => {
			const { workflows } = nodeDocs();
			const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
			expect(names).not.toContain("audit");
			expect(names).not.toContain("release");
		});
	});
});

describe("nextjs()", () => {
	describe("top-level fields", () => {
		it("sets org and domain", () => {
			const { org, domain } = nextjs();
			expect(org).toBe("theholocron");
			expect(domain).toBe("theholocron.dev");
		});
	});

	describe("providers", () => {
		it("sets vercel deployment and github secrets", () => {
			const { providers } = nextjs();
			expect(providers.deployment).toBe("vercel");
			expect(providers.secrets).toBe("github");
		});
	});

	describe("repo", () => {
		it("sets browser runtime environment", () => {
			const { repo } = nextjs();
			expect(repo.properties?.runtime_environment).toBe("browser");
		});

		it("includes Storybook and lhci required checks", () => {
			const { repo } = nextjs();
			expect(repo.requiredChecks).toContain("Storybook Publish");
			expect(repo.requiredChecks).toContain("UI Review");
			expect(repo.requiredChecks).toContain("UI Tests");
			expect(repo.requiredChecks).toContain("lhci/url/");
		});
	});

	describe("workflows", () => {
		it("includes audit with knip and performance", () => {
			const { workflows } = nextjs();
			const audit = workflows.find((w) => typeof w !== "string" && w.name === "audit");
			expect(audit).toMatchObject({ name: "audit", with: { "run-knip": true, "run-performance": true } });
		});

		it("includes test with storybook and interaction", () => {
			const { workflows } = nextjs();
			const test = workflows.find((w) => typeof w !== "string" && w.name === "test");
			expect(test).toMatchObject({
				name: "test",
				with: { "run-storybook": true, "run-interaction": true, "run-user-flow": true, "run-unit": false },
			});
		});
	});
});

describe("react()", () => {
	describe("providers", () => {
		it("does not include vercel deployment", () => {
			const { providers } = react();
			expect(providers.deployment).toBeUndefined();
		});

		it("sets github secrets", () => {
			const { providers } = react();
			expect(providers.secrets).toBe("github");
		});
	});

	describe("workflows", () => {
		it("includes test without run-user-flow", () => {
			const { workflows } = react();
			const test = workflows.find((w) => typeof w !== "string" && w.name === "test");
			expect(test).toMatchObject({ name: "test", with: { "run-storybook": true, "run-interaction": true } });
			if (typeof test !== "string" && test) {
				expect((test.with as Record<string, unknown>)["run-user-flow"]).toBeUndefined();
			}
		});
	});
});

describe("monorepo()", () => {
	it("wraps nextjs() and sets uses_external_packages to true", () => {
		const { repo } = monorepo(nextjs());
		expect(repo.properties?.uses_external_packages).toBe(true);
	});

	it("wraps react() and preserves browser runtime", () => {
		const { repo } = monorepo(react());
		expect(repo.properties?.runtime_environment).toBe("browser");
		expect(repo.properties?.uses_external_packages).toBe(true);
	});

	it("wraps nodeDocs() and preserves org and domain", () => {
		const result = monorepo(nodeDocs());
		expect(result.org).toBe("theholocron");
		expect(result.domain).toBe("theholocron.dev");
	});
});
