// ── Constants ───────────────────────────────────────────────────────────────
export { CLOUDFLARE_ACCOUNT_ID } from "./constants.js";

// ── compose() — re-exported from @theholocron/cli for convenience ───────────
export { compose } from "@theholocron/cli";
export type { Capability, ComposedPreset } from "@theholocron/cli";

// ── Capability factories ────────────────────────────────────────────────────
// Use these with compose() from @theholocron/cli to build a preset:
//   compose(node(), typecheck(), docs())
export { node } from "./capabilities/node.js";
export { typecheck } from "./capabilities/typecheck.js";
export { docs } from "./capabilities/docs.js";
export { audit } from "./capabilities/audit.js";
export type { AuditOptions } from "./capabilities/audit.js";
export { react as reactCapability } from "./capabilities/react.js";
export type { ReactOptions } from "./capabilities/react.js";
export { nextjs as nextjsBundle } from "./capabilities/nextjs.js";
export type { NextjsOptions } from "./capabilities/nextjs.js";
export { monorepo as monorepoCapability } from "./capabilities/monorepo.js";
export { wiki as wikiCapability } from "./capabilities/wiki.js";

// ── Preset shims ────────────────────────────────────────────────────────────
// Backward-compatible wrappers around compose(). Prefer the capability API
// for new repos — these exist so existing configs don't need to change at once.
export { nodeDocs, nodeDocsSite } from "./configs/node-docs.js";
export type { NodeDocsPreset, NodeDocsSitePreset } from "./configs/node-docs.js";
export { nextjs } from "./configs/nextjs.js";
export { react } from "./configs/react.js";
export { monorepo } from "./configs/monorepo.js";

// HolocronPreset is now ComposedPreset — re-exported for backward compat
export type { HolocronPreset } from "./configs/node.js";
