import type { Config } from 'tailwindcss'

// 外部フォントは読み込まない（オフラインでも同じ見た目にするため OS 標準の和文フォントを使う）
// macOS/iOS: Hiragino / Windows: Yu Gothic UI（"Yu Gothic" の Regular は細く見えるため UI 版を先に）/ Android・Linux: Noto CJK
const gothic = ['"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Yu Gothic UI"', '"Noto Sans JP"', '"Noto Sans CJK JP"', '"Yu Gothic"', 'YuGothic', 'Meiryo', 'system-ui', 'sans-serif']
// 明朝が無い環境（多くの Android）では serif → 端末既定に落ちる
const mincho = ['"Hiragino Mincho ProN"', '"Yu Mincho"', 'YuMincho', '"Noto Serif JP"', '"Noto Serif CJK JP"', '"BIZ UDPMincho"', 'serif']

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.ts'],
  theme: {
    extend: {
      colors: {
        // 白文字を載せても AA（4.5:1）になる青。Framer Blue #0099ff は 3:1 しかない
        accent: '#0a72e0',
        // エディタは明るい配色（Wix Studio Editor は明るい配色のみ提供、Squarespace / STUDIO も白基調）
        'ed-bg': '#f4f4f2',
        'ed-panel': '#ffffff',
        'ed-line': '#e2e2de',
        'ed-ink': '#18181b',
        'ed-muted': '#5c5c57', // 白で約 6.6:1、ed-bg で約 6:1
      },
      fontFamily: { gothic, mincho },
    },
  },
  plugins: [],
}
export default config
