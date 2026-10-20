import { defineConfig } from "@theholocron/astromech/config";

/**
 * The task-runner layer for this repo — repo-specific tasks, merged with
 * holocron.config.ts's intent-vocabulary tasks by astromech's
 * `loadTasksConfig` (ADR-0009, two-file config system).
 */
export default defineConfig({
	tasks: [
		// Build: sanity check that every workspace compiles to dist/. Also what
		// delivery.publish's run-build: true actually runs (pnpm build).
		// turbo.inputs appends "**/*.ts" to the registry default's "src/**"
		// (holocron#845) — same flat-layout override as holocron.config.ts's
		// sourceQuality.staticAnalysis/verification.*.
		{ name: "delivery.build", required: true, turbo: { inputs: ["**/*.ts"] } },
		// Audit, decomposed (epic #672, D3/#675 — the old single `audit` task's
		// jobs are now separate tasks). No lighthouse config referenced here
		// even though lighthouse-config is one of the packages — this repo
		// doesn't run Lighthouse against itself.
		{ name: "sourceQuality.deadCodeAnalysis", required: true },
		{ name: "delivery.bundleSize", required: true },
		// Publish: builds before publishing (matches the old release task's
		// run-build: true).
		{ name: "delivery.publish", with: { "run-build": true } },
		// Sync: keep generated files (workflows, labels, …) current on push to main.
		"platform.repoSync",
	],
});
