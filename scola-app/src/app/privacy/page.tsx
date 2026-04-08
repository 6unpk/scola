import type { Metadata } from 'next';
import PrivacyPage from './content';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '스콜라 개인정보처리방침 — 수집 항목, 이용 목적, 보유 기간, 이용자 권리 등을 안내합니다.',
  openGraph: {
    siteName: '스콜라',
    title: '개인정보처리방침 | 스콜라',
    description: '스콜라 개인정보처리방침',
    url: 'https://scola.kr/privacy',
    type: 'article',
  },
};

export default function Page() {
  return <PrivacyPage />;
}
