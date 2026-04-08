import type { Metadata } from 'next';
import TermsPage from './content';

export const metadata: Metadata = {
  title: '이용약관',
  description: '스콜라 이용약관 — 서비스 이용 조건, 회원 의무, 콘텐츠 정책 등을 안내합니다.',
  openGraph: {
    siteName: '스콜라',
    title: '이용약관 | 스콜라',
    description: '스콜라 이용약관',
    url: 'https://scola.kr/terms',
    type: 'article',
  },
};

export default function Page() {
  return <TermsPage />;
}
