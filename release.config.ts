import { defineConfig } from "@theholocron/semantic-release-config";

export default defineConfig({
	branches: ["main", { name: "alpha", prerelease: true }],
	assets: ["CHANGELOG.md", "package.json", "packages/*/package.json", "plugins/*/package.json"],
	exec: {
		prepareCmd: "pnpm exec holocron package bump-versions ${nextRelease.version}",
		publishCmd:
			'for dir in packages/*/ plugins/*/; do p=$(node -p "require(\'./$dir/package.json\').name"); v=$(node -p "require(\'./$dir/package.json\').version"); priv=$(node -p "require(\'./$dir/package.json\').private || false"); [ "$priv" = "true" ] && continue; npm view "$p@$v" version 2>/dev/null && echo "skip $p@$v" || pnpm --filter "./$dir" publish --access public --no-git-checks --tag ${nextRelease.channel || \'latest\'}; done',
	},
});
