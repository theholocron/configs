import type { Capability } from "@theholocron/cli";

export interface AuditOptions {
	/** Enable Knip unused-export analysis (default: false). */
	knip?: boolean;
	/** Enable Lighthouse performance audits (default: false). */
	performance?: boolean;
	/** Path to the Lighthouse config file. */
	lighthouseConfig?: string;
}

/**
 * Adds BundleWatch + optional Knip and Lighthouse auditing.
 * Requires: node
 */
export function audit({ knip = false, performance = false, lighthouseConfig }: AuditOptions = {}): Capability {
	const withBlock: Record<string, unknown> = {};
	if (knip) withBlock["run-knip"] = true;
	if (performance) withBlock["run-performance"] = true;
	if (lighthouseConfig) withBlock["lighthouse-config"] = lighthouseConfig;

	return {
		id: "audit",
		requires: ["node"],
		workflows: [Object.keys(withBlock).length > 0 ? { name: "audit", with: withBlock } : "audit"],
		requiredChecks: ["audit / Conclusion"],
	};
}
