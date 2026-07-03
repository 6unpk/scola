import type { Metadata } from 'next';
import { Bagel_Fat_One, IBM_Plex_Sans_KR } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import StyledRegistry from '@/lib/StyledRegistry';
import QueryProvider from '@/lib/QueryProvider';

const bagelFatOne = Bagel_Fat_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bagel-fat-one',
  display: 'swap',
});

// 실제 사용 웨이트만 (400/600/700). 300·500 제거.
const ibmPlexSansKR = IBM_Plex_Sans_KR({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans-kr',
  // swap: optional은 첫 방문 시 IBM Plex를 아예 건너뛰고 시스템폰트로 남는 경우가 많아
  // "폰트가 늦게 뜬다"처럼 보였음. swap으로 로드되는 즉시 적용.
  display: 'swap',
  // preload: 초기부터 폰트를 우선 요청해 늦게 붙는 현상 완화 (라틴 서브셋 프리로드).
  preload: true,
  // 스왑 시 레이아웃 밀림 최소화용 사이즈 조정 폴백 (기본 on, 명시).
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: '스콜라 - 사우나 찜질방 정보 후기',
    template: '%s | 스콜라',
  },
  description: '전국 사우나, 찜질방, 스파를 한 곳에서 찾아보세요. 위치, 시설 정보, 이용 후기까지.',
  keywords: ['사우나', '찜질방', '스파', '황토방', '불한증막', '사우나 추천', '찜질방 추천', '사우나 찾기'],
  authors: [{ name: '아온미디어', url: 'https://scola.kr' }],
  metadataBase: new URL('https://scola.kr'),
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://scola.kr',
    siteName: '스콜라',
    title: '스콜라 - 사우나 찜질방 정보 후기',
    description: '전국 사우나, 찜질방, 스파를 한 곳에서 찾아보세요.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '스콜라' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '스콜라 - 사우나 찜질방 정보 후기',
    description: '전국 사우나, 찜질방, 스파를 한 곳에서 찾아보세요.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${bagelFatOne.variable} ${ibmPlexSansKR.variable}`}>
      <body>
        <StyledRegistry>
          <QueryProvider>{children}</QueryProvider>
        </StyledRegistry>
        <Analytics />
      </body>
    </html>
  );
}
