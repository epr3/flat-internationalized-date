import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      name: "flat-internationalized-date",
      fileName: "index",
      entry: resolve(__dirname, "src/index.ts"),
    },
  },
});
