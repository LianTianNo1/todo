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
  basePath: '/todo',  // 添加这行，匹配 GitHub Pages 路径
  assetPrefix: '/todo/',  // 添加这行，确保资源正确加载
};

export default nextConfig;
