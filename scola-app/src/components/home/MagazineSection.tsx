'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ChevronRight } from 'lucide-react';
import { Section, SectionInner, SectionHeader, SectionTitle, SectionMore } from '@/components/home/SectionLayout';
import api from '@/lib/api';
import type { Post, PostsResponse } from '@/types/post';

const CATEGORY_LABELS: Record<string, string> = {
  sauna: '사우나 이야기',
  wellness: '건강 & 웰빙',
  travel: '여행 & 지역',
  guide: '가이드',
  etc: '기타',
};

const Row = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Card = styled.article`
  flex: 0 0 280px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-basis: 240px;
  }
`;

const Thumb = styled.div`
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.gray100};
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Cat = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.dark};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Excerpt = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray500};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Skeleton = styled.div`
  flex: 0 0 280px;
  height: 260px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.gray100};
`;

export default function MagazineSection() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PostsResponse>('/posts', { params: { per: 8, page: 1 } })
      .then((res) => setPosts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <Section>
      <SectionInner>
        <SectionHeader>
          <SectionTitle>스콜라 매거진</SectionTitle>
          <SectionMore onClick={() => router.push('/posts')}>
            전체보기 <ChevronRight size={15} />
          </SectionMore>
        </SectionHeader>
        <Row>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
            : posts.map((post) => (
                <Card key={post.id} onClick={() => router.push(`/posts/${post.slug}`)}>
                  <Thumb>{post.thumbnail && <img src={post.thumbnail} alt={post.title} loading="lazy" />}</Thumb>
                  <Body>
                    {post.category && <Cat>{CATEGORY_LABELS[post.category] ?? post.category}</Cat>}
                    <Title>{post.title}</Title>
                    {post.excerpt && <Excerpt>{post.excerpt}</Excerpt>}
                  </Body>
                </Card>
              ))}
        </Row>
      </SectionInner>
    </Section>
  );
}
