import type { NextConfig } from 'next';

// 開発時の Next.js インジケーターがデモ画面やスクリーンショットに重なるため消す
const nextConfig: NextConfig = { devIndicators: false };

export default nextConfig;
