import type { Capability } from "@theholocron/cli";

/**
 * Adds TypeScript type-checking to a repo.
 * Requires: node
 */
export function typecheck(): Capability {
	return {
		id: "typecheck",
		requires: ["node"],
		tasks: ["typecheck"],
		requiredChecks: ["Typecheck / Conclusion"],
	};
}
