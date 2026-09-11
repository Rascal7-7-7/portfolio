import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // E2E（Playwright）は別コマンドで動かすため除外する
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
    environment: "node",
  },
});
