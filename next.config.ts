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
  // 确保这些设置正确匹配 GitHub Pages 的路径
  basePath: process.env.NODE_ENV === 'production' ? '/todo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/todo/' : '',
  trailingSlash: true, // 添加这个确保 URL 以斜杠结尾
};

export default nextConfig;
