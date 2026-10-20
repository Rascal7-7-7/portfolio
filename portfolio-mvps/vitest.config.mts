import { defineConfig } from "vitest/config";

export default defineConfig({
  // tsconfig の jsx: preserve のままでは .tsx を読めないため、テスト時だけ JSX を変換する
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    // E2E（Playwright）は別コマンドで動かすため除外する
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
    environment: "node",
  },
});
