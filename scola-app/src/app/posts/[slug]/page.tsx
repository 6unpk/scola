import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostContent from './content';
import JsonLd from '@/components/seo/JsonLd';
import type { Post } from '@/types/post';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

export const revalidate = 3600;

async function fetchPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(slug)}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const params: { slug: string }[] = [];
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
      const res = await fetch(`${API_BASE}/posts?per=50&page=${page}`);
      if (!res.ok) break;
      const data = await res.json();
      (data.data ?? []).forEach((p: { slug: string }) => params.push({ slug: p.slug }));
      totalPages = data.meta?.total_pages ?? page;
      page++;
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: '게시글을 찾을 수 없습니다' };

  const url = `https://scola.kr/posts/${slug}`;
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || '';

  return {
    title,
    description,
    keywords: post.keywords ? post.keywords.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
    alternates: { canonical: url },
    openGraph: {
      siteName: '스콜라',
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      authors: post.author_name ? [post.author_name] : undefined,
      images: post.thumbnail ? [{ url: post.thumbnail, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

function buildArticleJsonLd(post: Post, slug: string) {
  const url = `https://scola.kr/posts/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.thumbnail || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: { '@type': 'Person', name: post.author_name },
    publisher: {
      '@type': 'Organization',
      name: '스콜라',
      logo: { '@type': 'ImageObject', url: 'https://scola.kr/web-app-manifest-512x512.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
}

function buildBreadcrumbJsonLd(post: Post, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://scola.kr' },
      { '@type': 'ListItem', position: 2, name: '매거진', item: 'https://scola.kr/posts' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://scola.kr/posts/${slug}` },
    ],
  };
}

export default async function PostDetailPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={buildArticleJsonLd(post, slug)} />
      <JsonLd data={buildBreadcrumbJsonLd(post, slug)} />
      <PostContent post={post} />
    </>
  );
}
