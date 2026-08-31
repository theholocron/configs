import { describe, expect, it } from "vitest";
import {
	audit,
	compose,
	docs,
	monorepo,
	monorepoCapability,
	nextjs,
	node,
	nodeDocs,
	nodeDocsSite,
	react,
	typecheck,
} from "./index.js";

describe("node() capability", () => {
	it("has id 'node'", () => {
		expect(node().id).toBe("node");
	});

	it("contributes Lint and Test required checks", () => {
		expect(node().requiredChecks).toContain("Lint / Conclusion");
		expect(node().requiredChecks).toContain("Test / Conclusion");
	});

	it("contributes the baseline workflow set without typecheck", () => {
		const names = (node().workflows ?? []).map((w) => (typeof w === "string" ? w : w.name));
		for (const expected of [
			"lint",
			"test",
			"codeql",
			"review",
			"stale",
			"greetings",
			"dependencies",
			"bookkeeping",
		]) {
			expect(names).toContain(expected);
		}
		expect(names).not.toContain("typecheck");
	});
});

describe("compose(node())", () => {
	it("produces a ComposedPreset with strict protection", () => {
		const { repo } = compose(node());
		expect(repo.protection).toBe("strict");
	});

	it("includes github source and ci providers", () => {
		const { providers } = compose(node());
		expect(providers.source).toBe("github");
		expect(providers.ci).toBe("github");
	});

	it("does not include typecheck (add typecheck() separately)", () => {
		const { workflows } = compose(node());
		const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
		expect(names).not.toContain("typecheck");
	});

	it("includes typecheck when typecheck() is composed in", () => {
		const { workflows } = compose(node(), typecheck());
		const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
		expect(names).toContain("typecheck");
	});

	it("includes deploy when docs() is composed in", () => {
		const { workflows } = compose(node(), docs());
		const deploy = workflows.find((w) => typeof w !== "string" && w.name === "deploy");
		expect(deploy).toMatchObject({ name: "deploy", with: { docs: true, preview: true } });
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
			const { docs: docsConfig } = nodeDocs();
			expect(docsConfig).toEqual({ build: "workflow", https: true });
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
		it("includes all Conclusion required checks", () => {
			const { repo } = nodeDocs();
			expect(repo.requiredChecks).toContain("Lint / Conclusion");
			expect(repo.requiredChecks).toContain("Test / Conclusion");
			expect(repo.requiredChecks).toContain("Typecheck / Conclusion");
			expect(repo.requiredChecks).toContain("audit / Conclusion");
		});

		it("includes codecov checks", () => {
			const { repo } = nodeDocs();
			expect(repo.requiredChecks).toContain("codecov/patch");
			expect(repo.requiredChecks).toContain("codecov/project");
		});
	});

	describe("workflows", () => {
		it("includes all node() baseline workflows and typecheck", () => {
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

		it("does not include audit workflow (stays repo-specific)", () => {
			const { workflows } = nodeDocs();
			const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
			expect(names).not.toContain("audit");
		});

		it("does not include release (stays repo-specific)", () => {
			const { workflows } = nodeDocs();
			const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
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

		it("includes test with storybook, interaction, and user-flow", () => {
			const { workflows } = nextjs();
			const test = workflows.find((w) => typeof w !== "string" && w.name === "test");
			expect(test).toMatchObject({
				name: "test",
				with: { "run-storybook": true, "run-interaction": true, "run-user-flow": true, "run-unit": false },
			});
		});

		it("merges test overrides into the single test entry", () => {
			const { workflows } = nextjs({ test: { "wait-on-url": "http://localhost:3000", "run-chromatic": true } });
			const test = workflows.find((w) => typeof w !== "string" && w.name === "test");
			expect(test).toMatchObject({
				name: "test",
				with: {
					"run-unit": false,
					"run-storybook": true,
					"run-interaction": true,
					"run-user-flow": true,
					"wait-on-url": "http://localhost:3000",
					"run-chromatic": true,
				},
			});
			expect(workflows.filter((w) => typeof w !== "string" && w.name === "test")).toHaveLength(1);
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

describe("audit() capability", () => {
	it("contributes plain string workflow when no options given", () => {
		const cap = audit();
		expect(cap.workflows).toContainEqual("audit");
	});

	it("contributes object workflow with run-knip when knip: true", () => {
		const cap = audit({ knip: true });
		expect(cap.workflows).toContainEqual({ name: "audit", with: { "run-knip": true } });
	});

	it("contributes object workflow with run-performance when performance: true", () => {
		const cap = audit({ performance: true });
		expect(cap.workflows).toContainEqual({ name: "audit", with: { "run-performance": true } });
	});

	it("includes lighthouseConfig in with block", () => {
		const cap = audit({ knip: true, performance: true, lighthouseConfig: "lighthouse.config.cjs" });
		expect(cap.workflows).toContainEqual({
			name: "audit",
			with: { "run-knip": true, "run-performance": true, "lighthouse-config": "lighthouse.config.cjs" },
		});
	});
});

describe("nodeDocsSite()", () => {
	it("sets org and domain", () => {
		const { org, domain } = nodeDocsSite();
		expect(org).toBe("theholocron");
		expect(domain).toBe("theholocron.dev");
	});

	it("does not include typecheck or audit workflows", () => {
		const { workflows } = nodeDocsSite();
		const names = workflows.map((w) => (typeof w === "string" ? w : w.name));
		expect(names).not.toContain("typecheck");
		expect(names).not.toContain("audit");
	});

	it("includes deploy with docs and preview", () => {
		const { workflows } = nodeDocsSite();
		const deploy = workflows.find((w) => typeof w !== "string" && w.name === "deploy");
		expect(deploy).toMatchObject({ name: "deploy", with: { docs: true, preview: true } });
	});

	it("does not include Typecheck or audit required checks", () => {
		const { repo } = nodeDocsSite();
		expect(repo.requiredChecks).not.toContain("Typecheck / Conclusion");
		expect(repo.requiredChecks).not.toContain("audit / Conclusion");
	});
});

describe("monorepoCapability()", () => {
	it("sets uses_external_packages to true when composed", () => {
		const { repo } = compose(node(), monorepoCapability());
		expect(repo.properties?.uses_external_packages).toBe(true);
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
