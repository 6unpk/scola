'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import LazyImage from '@/components/ui/LazyImage';
import type { Post } from '@/types/post';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// ─── Styled ───────────────────────────────────────────────────────────────────

const PageWrap = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  display: flex;
  flex-direction: column;
`;

const Hero = styled.div<{ $bg?: string | null }>`
  width: 100%;
  height: 380px;
  overflow: hidden;
  position: relative;
  background: ${({ $bg, theme }) => $bg ? theme.colors.dark : theme.colors.dark};
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%);
`;

const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 28px;
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(0,0,0,0.4);
  border: 1.5px solid rgba(255,255,255,0.25);
  border-radius: ${({ theme }) => theme.radius.full};
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(8px);
  align-self: flex-start;
  transition: background 0.15s;
  &:hover { background: rgba(0,0,0,0.6); }
`;

const HeroMeta = styled.div`display: flex; flex-direction: column; gap: 12px;`;

const HeroCat = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 12px;
  font-weight: 700;
  align-self: flex-start;
`;

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: white;
  line-height: 1.35;
  text-shadow: 0 2px 10px rgba(0,0,0,0.4);
  @media (max-width: 640px) { font-size: 22px; }
`;

const HeroInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const HeroInfoItem = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255,255,255,0.75);
  font-size: 13px;
`;

const Article = styled.article`
  max-width: 860px;
  margin: 48px auto;
  padding: 0 20px;
  flex: 1;
  width: 100%;
`;

const Body = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 48px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.dark};

  @media (max-width: 640px) { padding: 28px 20px; font-size: 15px; }

  h1, h2, h3, h4 {
    font-weight: 800;
    margin: 2em 0 0.6em;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.dark};
  }
  h1 { font-size: 1.6em; }
  h2 {
    font-size: 1.3em;
    padding-bottom: 10px;
    border-bottom: 2px solid ${({ theme }) => theme.colors.gray200};
  }
  h3 { font-size: 1.1em; }

  p { margin: 1em 0; }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  blockquote {
    margin: 1.5em 0;
    padding: 16px 20px;
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.gray50};
    border-radius: 0 ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0;
    font-style: italic;
    color: ${({ theme }) => theme.colors.gray500};
  }

  ul, ol {
    padding-left: 1.5em;
    margin: 1em 0;
    li { margin: 0.4em 0; }
  }

  code {
    font-family: 'Courier New', monospace;
    font-size: 0.88em;
    background: ${({ theme }) => theme.colors.gray100};
    padding: 2px 6px;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.primary};
  }

  pre {
    background: ${({ theme }) => theme.colors.dark};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 20px;
    overflow-x: auto;
    margin: 1.5em 0;
    code {
      background: none;
      color: #e0e0e0;
      padding: 0;
      font-size: 0.9em;
    }
  }

  img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.radius.lg};
    margin: 1.5em 0;
  }

  hr {
    border: none;
    border-top: 1.5px solid ${({ theme }) => theme.colors.gray200};
    margin: 2em 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;
    font-size: 0.93em;
    th, td {
      border: 1px solid ${({ theme }) => theme.colors.gray200};
      padding: 10px 14px;
      text-align: left;
    }
    th {
      background: ${({ theme }) => theme.colors.gray50};
      font-weight: 700;
    }
  }

  strong { font-weight: 800; }
`;

const PlaceholderHero = styled.div`
  width: 100%;
  height: 380px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dark} 0%, #2a2a2a 100%);
  position: relative;
`;

const SkeletonWrap = styled.div`
  max-width: 860px;
  margin: 48px auto;
  padding: 0 20px;
`;

const SkeletonBody = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 48px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonLine = styled.div<{ $w?: string; $h?: string }>`
  height: ${({ $h }) => $h ?? '16px'};
  width: ${({ $w }) => $w ?? '100%'};
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const CAT_LABELS: Record<string, string> = {
  sauna: '사우나 이야기', wellness: '건강 & 웰빙',
  travel: '여행 & 지역', guide: '가이드', etc: '기타',
};

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get<{ data: Post }>(`/posts/${slug}`)
      .then((res) => setPost(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (d: string | null) => {
    if (!d) return '';
    return format(new Date(d), 'yyyy년 M월 d일', { locale: ko });
  };

  if (loading) {
    return (
      <PageWrap>
        <Navbar />
        <PlaceholderHero />
        <SkeletonWrap>
          <SkeletonBody>
            <SkeletonLine $w="20%" $h="12px" />
            <SkeletonLine $w="70%" $h="24px" />
            <SkeletonLine $w="100%" />
            <SkeletonLine $w="95%" />
            <SkeletonLine $w="88%" />
            <SkeletonLine $w="60%" />
          </SkeletonBody>
        </SkeletonWrap>
        <Footer />
      </PageWrap>
    );
  }

  if (notFound || !post) {
    return (
      <PageWrap>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40 }}>
          <p style={{ fontSize: 18, fontWeight: 700 }}>게시글을 찾을 수 없습니다.</p>
          <button onClick={() => router.push('/posts')} style={{ padding: '10px 24px', background: '#A62121', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
            목록으로
          </button>
        </div>
        <Footer />
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <Navbar />

      {post.thumbnail ? (
        <Hero $bg={post.thumbnail}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.75 }}>
            <LazyImage src={post.thumbnail} alt={post.title} />
          </div>
          <HeroOverlay />
          <HeroContent>
            <BackBtn onClick={() => router.push('/posts')}>
              <ArrowLeft size={14} /> 목록으로
            </BackBtn>
            <HeroMeta>
              {post.category && <HeroCat>{CAT_LABELS[post.category] ?? post.category}</HeroCat>}
              <HeroTitle>{post.title}</HeroTitle>
              <HeroInfo>
                <HeroInfoItem><User size={13} />{post.author_name}</HeroInfoItem>
                <HeroInfoItem><Calendar size={13} />{formatDate(post.published_at)}</HeroInfoItem>
              </HeroInfo>
            </HeroMeta>
          </HeroContent>
        </Hero>
      ) : (
        <PlaceholderHero>
          <HeroContent>
            <BackBtn onClick={() => router.push('/posts')}>
              <ArrowLeft size={14} /> 목록으로
            </BackBtn>
            <HeroMeta>
              {post.category && <HeroCat>{CAT_LABELS[post.category] ?? post.category}</HeroCat>}
              <HeroTitle>{post.title}</HeroTitle>
              <HeroInfo>
                <HeroInfoItem><User size={13} />{post.author_name}</HeroInfoItem>
                <HeroInfoItem><Calendar size={13} />{formatDate(post.published_at)}</HeroInfoItem>
              </HeroInfo>
            </HeroMeta>
          </HeroContent>
        </PlaceholderHero>
      )}

      <Article>
        <Body>
          {post.body ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          ) : (
            <p style={{ color: '#9E9E9E', textAlign: 'center', padding: '40px 0' }}>내용이 없습니다.</p>
          )}
        </Body>
      </Article>

      <Footer />
    </PageWrap>
  );
}
