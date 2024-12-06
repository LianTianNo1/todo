import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // 在生产环境中不建议禁用类型检查
    // 这里仅用于开发阶段快速调试
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
