import { defineConfig } from "next";

export default defineConfig({
  experimental: {
    appDir: true,
    // Allow CJS modules (like font-loader internals) in ESM scope:
    esmExternals: "loose",
  },
});
