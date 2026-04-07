import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/mypage', '/login', '/register', '/api/'],
      },
    ],
    sitemap: 'https://scola.kr/sitemap.xml',
    host: 'https://scola.kr',
  };
}
