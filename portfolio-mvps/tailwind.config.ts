import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          // 400 は未定義で、指定した文字色が白のまま表示されていた
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          // 700 / 800 は白文字を載せる CTA 用。
          // 600 は白文字とのコントラストが 4.1:1 で WCAG AA（4.5:1）に届かないため、
          // 塗りつぶしボタンの背景には 700（5.8:1）以上を使う。
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        surface: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          // 300〜700 は未定義で、指定した文字色が生成されず白のまま表示されていた。
          // 暗い背景（800〜950）で AA（4.5:1）を満たすのは 400 まで。
          // 500 以降は明るい背景の文字色にだけ使う。
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
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
