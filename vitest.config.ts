import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  resolve: {
    alias: {
      "@": r("./src"),
    },
  },
  test: {
    globals: true,
    exclude: ["**/node_modules/**"],
    include: ["./**/*.test.{ts,js}"],
    coverage: {
      provider: "istanbul", // or 'v8'
    },
    // globalSetup: "./vitest.global.ts",
    // setupFiles: "./vitest.setup.ts",
  },
});
