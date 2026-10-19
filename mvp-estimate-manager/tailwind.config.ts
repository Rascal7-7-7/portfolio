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
        muted: "#64748d",
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
      boxShadow: {
        card: "0 2px 5px -1px rgba(50,50,93,0.25), 0 1px 3px -1px rgba(0,0,0,0.3)",
        float: "0 13px 27px -5px rgba(50,50,93,0.25), 0 8px 16px -8px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
