#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nextVersion = process.argv[2]

if (!nextVersion) {
	console.error('usage: bump-versions.mjs <next-version>')
	process.exit(1)
}

function bumpFile(absPath, label) {
	const pkg = JSON.parse(readFileSync(absPath, 'utf8'))
	const old = pkg.version
	pkg.version = nextVersion
	writeFileSync(absPath, JSON.stringify(pkg, null, 2) + '\n')
	console.log(`  ✓ ${label}: ${old} → ${nextVersion}`)
}

console.log(`Bumping configs monorepo to ${nextVersion}…`)

// Root is always bumped — private means "don't publish", not "don't version".
bumpFile(join(repoRoot, 'package.json'), '@theholocron/configs-monorepo')

const packagesDir = join(repoRoot, 'packages')
const entries = readdirSync(packagesDir)
for (const entry of entries) {
	const pkgDir = join(packagesDir, entry)
	if (!statSync(pkgDir).isDirectory()) continue
	const pkgFile = join(pkgDir, 'package.json')
	let pkg
	try {
		pkg = JSON.parse(readFileSync(pkgFile, 'utf8'))
	} catch {
		continue
	}
	if (pkg.private) {
		console.log(`  · skipping private package packages/${entry}`)
		continue
	}
	bumpFile(pkgFile, `packages/${entry}`)
}
