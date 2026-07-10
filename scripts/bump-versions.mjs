#!/usr/bin/env node
/**
 * Lockstep version bump for the configs monorepo.
 * Called by semantic-release prepareCmd:
 *   node scripts/bump-versions.mjs <new-version>
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[\w.]+)?(?:\+[\w.]+)?$/;
const version = process.argv[2];
if (!version || !SEMVER_RE.test(version)) {
	console.error("Usage: node scripts/bump-versions.mjs <new-version>");
	process.exit(1);
}

const cwd = fileURLToPath(new URL("..", import.meta.url));

function bumpFile(absPath, label) {
	const pkg = JSON.parse(readFileSync(absPath, "utf8"));
	const old = pkg.version;
	pkg.version = version;
	writeFileSync(absPath, JSON.stringify(pkg, null, 2) + "\n");
	console.log(`  ✓ ${label}: ${old} → ${version}`);
}

console.log(`Bumping monorepo to ${version}…`);
bumpFile(join(cwd, "package.json"), "root");

for (const entry of readdirSync(join(cwd, "packages"))) {
	const pkgDir = join(cwd, "packages", entry);
	if (!statSync(pkgDir).isDirectory()) continue;
	const pkgFile = join(pkgDir, "package.json");
	let pkg;
	try {
		pkg = JSON.parse(readFileSync(pkgFile, "utf8"));
	} catch {
		continue;
	}
	if (pkg.private) {
		console.log(`  · skipping private package packages/${entry}`);
		continue;
	}
	bumpFile(pkgFile, `packages/${entry}`);
}
