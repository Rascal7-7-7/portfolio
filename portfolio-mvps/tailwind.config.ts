import type { Config } from "tailwindcss";

/*
 * 明るい背景（paper）の上に文字を置く前提の配色。
 * コントラスト比はすべて paper(#fcfbf8) に対する値。
 * 色は「文字の濃さ3段＋アクセント1色＋罫線＋コード地」だけに絞っている。
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /** 地の色。真っ白より少しだけ黄みに寄せた生成り。 */
        paper: "#fcfbf8",
        ink: {
          /** 見出し・本文。16.6:1 */
          DEFAULT: "#1c1b19",
          /** 説明文・補足。7.8:1（AA の 4.5:1 を余裕をもって満たす） */
          muted: "#52504b",
          /** 日付・技術名などのメタ情報。5.3:1。これより薄い色を文字に使わない */
          subtle: "#6b6963",
        },
        /** 罫線専用。文字には使わない（1.24:1） */
        rule: "#e6e3dc",
        /** 根拠の <pre> の地。ink.muted を載せて 7.1:1、ink.subtle は 4.8:1 */
        code: "#f2f0ea",
        /**
         * アクセントは1色だけ。旧 brand-700 を少し濃くした青。
         * 文字色として 7.1:1、白文字を載せた塗りでも 7.4:1。
         * hover はさらに濃い 9.9:1。
         */
        accent: {
          DEFAULT: "#035a8c",
          hover: "#02446b",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-noto-sans-jp)",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
