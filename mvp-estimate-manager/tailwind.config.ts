import type { Config } from "tailwindcss";

// Stripe のデザインシステム（awesome-design-md: stripe/DESIGN.md）を参考にしたトークン
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#533afd", hover: "#4434d4", soft: "#eeebff" },
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
