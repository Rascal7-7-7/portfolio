import type { Config } from "tailwindcss";

/*
 * 黒い背景（paper）の上に文字を置く前提の配色。トップの 3D の舞台として暗くしている。
 * コントラスト比はすべて paper(#08090b) に対する値。
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
        /** 地の色。真っ黒より少しだけ青みに寄せた黒。 */
        paper: "#08090b",
        ink: {
          /** 見出し・本文。17.0:1 */
          DEFAULT: "#ededeb",
          /** 説明文・補足。8.3:1（AA の 4.5:1 を余裕をもって満たす） */
          muted: "#a6a7aa",
          /** 日付・技術名などのメタ情報。6.0:1。これより薄い色を文字に使わない */
          subtle: "#8b8d92",
        },
        /** 罫線専用。文字には使わない（1.32:1） */
        rule: "#24262b",
        /** 根拠の <pre> の地。ink.muted を載せて 7.7:1、ink.subtle は 5.6:1 */
        code: "#111318",
        /**
         * アクセントは1色だけ。favicon と同じ系統の空色。
         * 文字色として 10.9:1、hover はさらに明るい 13.3:1。
         * 塗りに使うときは文字を paper（黒）にする。
         */
        accent: {
          DEFAULT: "#5ccbff",
          hover: "#9adcff",
        },
        /** トップの 3D と凡例で「注入された命令」を表す赤。意味を持つ箇所以外には使わない */
        danger: "#ff5c7a",
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
