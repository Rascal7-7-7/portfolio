import type { Config } from "tailwindcss";

// Stripe のデザインシステム（awesome-design-md: stripe/DESIGN.md）を参考にしたトークン
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 主色は帳票・業務ツールらしい深い藍（白地 9.4:1）。アクセントはこの1色だけ
        primary: { DEFAULT: "#24467a", hover: "#1b365f", soft: "#e9eef5" },
        navy: "#061b31",
        body: "#425466",
        muted: "#5f6f87",
        line: "#e5edf5",
        canvas: "#f6f9fc",
      },
      fontFamily: {
        sans: [
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Noto Sans JP",
          "Yu Gothic UI",
          "Meiryo",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
