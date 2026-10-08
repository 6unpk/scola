import type { Metadata } from 'next';
import PostsListContent from './content';
import JsonLd from '@/components/seo/JsonLd';
import type { Post, PostsResponse } from '@/types/post';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

export const revalidate = 60;

async function fetchFirstPage(): Promise<PostsResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/posts?per=9&page=1`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

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
    images: [{ url: 'https://scola.kr/og-image.png', width: 1200, height: 630, alt: '스콜라 매거진' }],
  },
  twitter: { card: 'summary_large_image', title: `${title} | 스콜라`, description, images: ['https://scola.kr/og-image.png'] },
};

export default async function Page() {
  const first = await fetchFirstPage();
  const posts: Post[] = first?.data ?? [];
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '스콜라 매거진',
    numberOfItems: posts.length,
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://scola.kr/posts/${p.slug}`,
      name: p.title,
    })),
  };
  return (
    <>
      {posts.length > 0 && <JsonLd data={itemList} />}
      <PostsListContent
        initialPosts={first ? posts : undefined}
        initialMeta={first ? { total: first.meta.total, total_pages: first.meta.total_pages } : undefined}
      />
    </>
  );
}
