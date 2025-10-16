import { defineConfig } from "tsup";

export default defineConfig([
  // Client components (with 'use client')
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "next", "stripe"],
    banner: {
      js: "'use client';",
    },
  },
  // Server-side API (NO 'use client')
  {
    entry: ["src/api/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false, // Don't clean since we're building separately
    external: ["react", "react-dom", "next", "stripe"],
    outDir: "dist/api",
  },
]);
