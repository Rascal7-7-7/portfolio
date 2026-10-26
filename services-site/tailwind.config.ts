import type { Config } from "tailwindcss";

/*
 * 依頼用サイトの配色。Cal.com に倣い、サイトの枠は無彩色だけにする（色は作例の画面写真が担う）。
 * コントラスト比は canvas(#ffffff) / soft(#f6f5f2) に対する値。
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#ffffff",
        /** 節を分けるための、ほとんど白に近い生成り */
        soft: "#f6f5f2",
        ink: {
          /** 見出し・本文・主ボタン。16.5:1 / 15.1:1 */
          DEFAULT: "#1f1f1f",
          /** 説明文。7.5:1 / 6.8:1 */
          muted: "#555555",
          /** 補足・注記。5.3:1 / 4.9:1。これより薄い色を文字に使わない */
          subtle: "#6b6b6b",
        },
        /** 罫線専用 */
        line: "#e7e5e0",
      },
      fontFamily: {
        sans: ["var(--font-zen-kaku)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        /** 枠線の代わりに使う、輪郭 + ごく薄い影（Cal.com の ring shadow） */
        card: "0 0 0 1px rgba(34,42,53,0.08), 0 1px 2px rgba(34,42,53,0.04), 0 12px 32px -16px rgba(34,42,53,0.18)",
        /** 画面写真用。少し深く浮かせる */
        shot: "0 0 0 1px rgba(34,42,53,0.10), 0 2px 4px rgba(34,42,53,0.05), 0 24px 48px -24px rgba(34,42,53,0.28)",
      },
    },
  },
  plugins: [],
};
export default config;
