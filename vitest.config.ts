/// <reference types="vitest/config" />
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
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
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  test: {
    globals: true,
    setupFiles: ["src/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      exclude: ["src/__tests__/**", "**/*.d.ts"],
    },
    projects: [
      // Project 1: Storybook tests (browser environment)
      {
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          include: ["**/*.stories.@(js|jsx|ts|tsx)"],
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
      // Project 2: Unit tests (Node.js environment)
      {
        resolve: {
          alias: {
            "@": path.resolve(dirname, "./src"),
          },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
        test: {
          name: "unit",
          include: ["src/__tests__/**/*.test.ts"],
          environment: "node",
        },
      },
    ],
  },
});
