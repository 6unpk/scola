import type { Metadata } from 'next';
import { Bagel_Fat_One, IBM_Plex_Sans_KR } from 'next/font/google';
import StyledRegistry from '@/lib/StyledRegistry';
import QueryProvider from '@/lib/QueryProvider';

const bagelFatOne = Bagel_Fat_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bagel-fat-one',
  display: 'swap',
});

const ibmPlexSansKR = IBM_Plex_Sans_KR({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans-kr',
  display: 'swap',
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
      </body>
    </html>
  );
}
