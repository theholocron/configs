import { defineConfig } from "tsdown";
export default defineConfig({
	entry: ["index.ts", "configs/*.ts"],
	format: "esm",
	fixedExtension: false,
	dts: true,
	clean: true,
});
