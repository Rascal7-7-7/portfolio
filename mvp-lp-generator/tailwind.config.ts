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
        'ed-bg': '#0a0a0a',
        'ed-panel': '#141414',
        'ed-muted': '#a6a6a6',
      },
      fontFamily: { gothic, mincho },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: { 'fade-in': 'fade-in 0.45s ease-out both' },
    },
  },
  plugins: [],
}
export default config
