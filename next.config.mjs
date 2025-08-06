import { defineConfig } from "next";

export default defineConfig({
  experimental: {
    appDir: true,
    optimizeFonts: false,      // ← turn off the CJS-based font optimizer
    esmExternals: "loose",     // ← allow any remaining CJS deps
  },
});
