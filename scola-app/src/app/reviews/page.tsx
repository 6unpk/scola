import type { Metadata } from 'next';
import ReviewsPage from './content';

export const metadata: Metadata = {
  title: '이용 후기',
  description: '전국 사우나·찜질방·스파 이용자들의 생생한 후기를 확인하세요.',
  openGraph: {
    siteName: '스콜라',
    title: '이용 후기 | 스콜라',
    description: '전국 사우나·찜질방·스파 이용자들의 생생한 후기를 확인하세요.',
    url: 'https://scola.kr/reviews',
    type: 'website',
  },
};

export default function Page() {
  return <ReviewsPage />;
}
