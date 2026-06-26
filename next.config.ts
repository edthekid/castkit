import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 親ディレクトリにも lockfile があり Turbopack がワークスペースルートを
  // 誤認する警告が出るため、このプロジェクト自身をルートとして明示する。
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
