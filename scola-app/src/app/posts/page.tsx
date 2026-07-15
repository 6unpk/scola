import type { Metadata } from 'next';
import PostsListContent from './content';

const title = '스콜라 매거진 — 사우나·찜질방 이야기';
const description =
  '사우나 문화, 건강 & 웰빙, 여행과 지역 이야기를 담은 스콜라 매거진. 사우나·찜질방·온천을 제대로 즐기는 법을 읽어보세요.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['사우나 매거진', '찜질방 이야기', '사우나 문화', '사우나 건강', '온천 여행'],
  alternates: { canonical: 'https://scola.kr/posts' },
  openGraph: {
    siteName: '스콜라',
    title: `${title} | 스콜라`,
    description,
    url: 'https://scola.kr/posts',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: `${title} | 스콜라`, description },
};

export default function Page() {
  return <PostsListContent />;
}
