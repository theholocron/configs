import type { Capability } from "@theholocron/cli";

/**
 * Adjusts a repo to be a monorepo — sets uses_external_packages: true
 * (workspaces pull in many deps). Compose after the base capabilities.
 * Requires: node
 *
 * @example
 * const preset = compose(node(), typecheck(), nextjs(), monorepo());
 */
export function monorepo(): Capability {
	return {
		id: "monorepo",
		requires: ["node"],
		repo: {
			properties: { uses_external_packages: true },
		},
	};
}
