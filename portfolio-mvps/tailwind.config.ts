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
