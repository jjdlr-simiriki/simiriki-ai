/** @type {import('next').NextConfig} */
export default {
  experimental: {
    appDir: true,
    optimizeFonts: false,      // disable the CJS font optimizer
    esmExternals: "loose",     // allow CommonJS deps at runtime
  },
};
