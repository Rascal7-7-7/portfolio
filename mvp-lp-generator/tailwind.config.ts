import type { Config } from 'tailwindcss'

// 外部フォントは読み込まない（オフラインでも同じ見た目にするため OS 標準の和文フォントを使う）
const gothic = ['"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Noto Sans JP"', '"Yu Gothic"', 'Meiryo', 'system-ui', 'sans-serif']
const mincho = ['"Hiragino Mincho ProN"', '"Yu Mincho"', '"Noto Serif JP"', 'serif']

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.ts'],
  theme: {
    extend: {
      colors: {
        accent: '#0099ff',
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
