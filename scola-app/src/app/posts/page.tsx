'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Calendar, User, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import LazyImage from '@/components/ui/LazyImage';
import type { Post, PostsResponse } from '@/types/post';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// ─── Styled ───────────────────────────────────────────────────────────────────

const PageWrap = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  display: flex;
  flex-direction: column;
`;

const Hero = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  padding: 64px 20px 48px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: 900;
  color: white;
  margin-bottom: 12px;
`;

const HeroSub = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 20px;
  flex: 1;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 36px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 7px 18px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 13px;
  font-weight: 700;
  border: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.gray200};
  background: ${({ theme, $active }) => $active ? theme.colors.primary : 'white'};
  color: ${({ theme, $active }) => $active ? 'white' : theme.colors.gray500};
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme, $active }) => $active ? 'white' : theme.colors.primary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 580px) { grid-template-columns: 1fr; }
`;

const Card = styled.article`
  background: white;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const CardThumb = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.gray100};
  overflow: hidden;
`;

const CardThumbPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
`;

const CardBody = styled.div`padding: 20px;`;

const CardCat = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primaryLight ?? '#fef2f2'};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.45;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardExcerpt = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16px;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ReadMore = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 12px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 15px;
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const SkeletonThumb = styled.div`
  width: 100%; aspect-ratio: 16/9;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;

const SkeletonBody = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 8px;`;
const SkeletonLine = styled.div<{ $w?: string }>`
  height: 14px; border-radius: 4px;
  width: ${({ $w }) => $w ?? '100%'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
`;

const Pagination = styled.div`
  display: flex; gap: 6px; justify-content: center; margin-top: 48px;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  width: 36px; height: 36px; border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px; font-weight: 600; cursor: pointer;
  border: 1.5px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.gray200};
  background: ${({ theme, $active }) => $active ? theme.colors.primary : 'white'};
  color: ${({ theme, $active }) => $active ? 'white' : theme.colors.gray500};
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: '', label: '전체' },
  { value: 'sauna', label: '사우나 이야기' },
  { value: 'wellness', label: '건강 & 웰빙' },
  { value: 'travel', label: '여행 & 지역' },
  { value: 'guide', label: '가이드' },
  { value: 'etc', label: '기타' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostsPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState({ total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), per: '9' };
      if (category) params.category = category;
      const res = await api.get<PostsResponse>('/posts', { params });
      setPosts(res.data.data);
      setMeta(res.data.meta);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [category]);

  const formatDate = (d: string | null) => {
    if (!d) return '';
    return format(new Date(d), 'yyyy. M. d.', { locale: ko });
  };

  const catLabel = (v: string | null) =>
    CATEGORIES.find((c) => c.value === (v ?? ''))?.label ?? v ?? '';

  return (
    <PageWrap>
      <Navbar />

      <Hero>
        <HeroTitle>스콜라 매거진</HeroTitle>
        <HeroSub>사우나 문화, 건강, 여행에 관한 이야기를 담습니다</HeroSub>
      </Hero>

      <Inner>
        <CategoryTabs>
          {CATEGORIES.map((c) => (
            <Tab key={c.value} $active={category === c.value} onClick={() => setCategory(c.value)}>
              {c.label}
            </Tab>
          ))}
        </CategoryTabs>

        <Grid>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i}>
                <SkeletonThumb />
                <SkeletonBody>
                  <SkeletonLine $w="30%" />
                  <SkeletonLine $w="80%" />
                  <SkeletonLine $w="90%" />
                  <SkeletonLine $w="60%" />
                </SkeletonBody>
              </SkeletonCard>
            ))
          ) : posts.length === 0 ? (
            <EmptyState style={{ gridColumn: '1/-1' }}>아직 게시글이 없습니다.</EmptyState>
          ) : (
            posts.map((post) => (
              <Card key={post.id} onClick={() => router.push(`/posts/${post.slug}`)}>
                <CardThumb>
                  {post.thumbnail ? (
                    <LazyImage src={post.thumbnail} alt={post.title} />
                  ) : (
                    <CardThumbPlaceholder>🛁</CardThumbPlaceholder>
                  )}
                </CardThumb>
                <CardBody>
                  {post.category && <CardCat>{catLabel(post.category)}</CardCat>}
                  <CardTitle>{post.title}</CardTitle>
                  {post.excerpt && <CardExcerpt>{post.excerpt}</CardExcerpt>}
                  <CardMeta>
                    <MetaItem><User size={11} />{post.author_name}</MetaItem>
                    <MetaItem><Calendar size={11} />{formatDate(post.published_at)}</MetaItem>
                    <ReadMore>읽기 <ChevronRight size={12} /></ReadMore>
                  </CardMeta>
                </CardBody>
              </Card>
            ))
          )}
        </Grid>

        {meta.total_pages > 1 && (
          <Pagination>
            <PageBtn onClick={() => setPage((p) => p - 1)} disabled={page === 1}>‹</PageBtn>
            {Array.from({ length: Math.min(meta.total_pages, 10) }, (_, i) => {
              const n = Math.max(1, Math.min(page - 4, meta.total_pages - 9)) + i;
              return <PageBtn key={n} $active={n === page} onClick={() => setPage(n)}>{n}</PageBtn>;
            })}
            <PageBtn onClick={() => setPage((p) => p + 1)} disabled={page === meta.total_pages}>›</PageBtn>
          </Pagination>
        )}
      </Inner>

      <Footer />
    </PageWrap>
  );
}
