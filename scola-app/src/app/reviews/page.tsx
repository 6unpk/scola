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
    images: [{ url: 'https://scola.kr/og-image.png', width: 1200, height: 630, alt: '스콜라 — 이용 후기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '이용 후기 | 스콜라',
    description: '전국 사우나·찜질방·스파 이용자들의 생생한 후기를 확인하세요.',
    images: ['https://scola.kr/og-image.png'],
  },
};

export default function Page() {
  return <ReviewsPage />;
}
