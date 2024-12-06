import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // 在生产环境中不建议禁用类型检查
    // 这里仅用于开发阶段快速调试
    ignoreBuildErrors: true,
  },
  output: 'export',  // 添加这行来启用静态导出
  images: {
    unoptimized: true, // 静态导出需要这个配置
  },
};

export default nextConfig;
