import { defineConfig } from "tsup";
import path from "path";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		client: "src/client.ts",
		server: "src/server.ts",
	},
	outDir: "dist",
	format: ["esm", "cjs"],
	sourcemap: true,
	dts: true,
	clean: true,
	external: ["react", "next"],
	treeshake: true,
	splitting: false,
	bundle: true
});
