import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    // 아이콘/유틸 라이브러리 tree-shaking 강화
    optimizePackageImports: [
      'lucide-react',
      '@remixicon/react',
      'motion',
      'date-fns',
    ],
  },
  // 프로덕션 빌드 압축 (기본값이지만 명시)
  compress: true,
  // 불필요한 X-Powered-By 헤더 제거
  poweredByHeader: false,
};

export default nextConfig;
