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
  title: 'Scola - 사우나 & 찜질방 탐색',
  description: '내 주변 사우나와 찜질방을 쉽게 찾아보세요',
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
