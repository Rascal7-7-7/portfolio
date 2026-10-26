/** @type {import('next').NextConfig} */
const nextConfig = {
  // budoux はサーバーで文節を分けるためだけに使う。バンドルすると、使わない HTML 処理部分の
  // 依存（linkedom → cssstyle）の解決で警告が出るため、Node からそのまま読み込ませる
  experimental: {
    serverComponentsExternalPackages: ["budoux"],
  },
  // CSP は next/font・インライン script への影響を検証していないため、まだ付けない
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
