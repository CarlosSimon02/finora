/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
      "@tests": path.resolve(dirname, "./src/__tests__"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  test: {
    globals: true,
    setupFiles: ["src/__tests__/setup.ts"],
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    coverage: {
      provider: "v8",
      exclude: ["src/__tests__/**", "**/*.d.ts", "**/*.stories.*"],
    },
    // Only run unit tests by default (no Storybook tests)
    include: ["src/__tests__/**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      "**/*.stories.*",
      "**/.storybook/**",
    ],
    environment: "node",
    // Uncomment the projects below to enable Storybook tests
    // (requires: yarn playwright install)
    // projects: [
    //   // Project 1: Storybook tests (browser environment)
    //   {
    //     plugins: [
    //       storybookTest({
    //         configDir: path.join(dirname, ".storybook"),
    //       }),
    //     ],
    //     test: {
    //       name: "storybook",
    //       include: ["**/*.stories.@(js|jsx|ts|tsx)"],
    //       browser: {
    //         enabled: true,
    //         headless: true,
    //         provider: "playwright",
    //         instances: [
    //           {
    //             browser: "chromium",
    //           },
    //         ],
    //       },
    //       setupFiles: [".storybook/vitest.setup.ts"],
    //     },
    //   },
    //   // Project 2: Unit tests (Node.js environment)
    //   {
    //     resolve: {
    //       alias: {
    //         "@": path.resolve(dirname, "./src"),
    //       },
    //       extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    //     },
    //     test: {
    //       name: "unit",
    //       include: ["src/__tests__/**/*.test.ts"],
    //       environment: "node",
    //     },
    //   },
    // ],
  },
});
