import type { Metadata } from 'next';
import TermsPage from './content';

export const metadata: Metadata = {
  title: '이용약관',
  description: 'Scola(스콜라) 이용약관 — 서비스 이용 조건, 회원 의무, 콘텐츠 정책 등을 안내합니다.',
  openGraph: {
    title: '이용약관 | Scola',
    description: 'Scola(스콜라) 이용약관',
    url: 'https://scola.kr/terms',
    type: 'article',
  },
};

export default function Page() {
  return <TermsPage />;
}
