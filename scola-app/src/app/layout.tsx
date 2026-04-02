import type { Metadata } from 'next';
import StyledRegistry from '@/lib/StyledRegistry';
import QueryProvider from '@/lib/QueryProvider';

export const metadata: Metadata = {
  title: 'Scola - 학원 강사 CRM',
  description: '학원 강사를 위한 학생/수업/출결 관리 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <StyledRegistry>
          <QueryProvider>{children}</QueryProvider>
        </StyledRegistry>
      </body>
    </html>
  );
}
