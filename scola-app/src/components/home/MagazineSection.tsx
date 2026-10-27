'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ChevronRight } from 'lucide-react';
import { Section, SectionInner, SectionHeader, SectionTitle, SectionMore } from '@/components/home/SectionLayout';
import api from '@/lib/api';
import type { Post, PostsResponse } from '@/types/post';
import { cardBase, cardHover, cardThumbDivider } from '@/components/ui/Card';

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
  ${cardBase}
  ${cardHover}
`;

const Thumb = styled.div`
  height: 140px;
  flex-shrink: 0;
  ${cardThumbDivider}
  background: ${({ theme }) => theme.colors.gray100};
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

const Body = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Cat = styled.span`
  height: 14px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  height: 42px;
  color: ${({ theme }) => theme.colors.dark};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Excerpt = styled.p`
  font-size: 13px;
  line-height: 1.5;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray500};
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Skeleton = styled.div`
  flex: 0 0 280px;
  height: 256px;
  ${cardBase}
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
                    <Cat>{post.category ? CATEGORY_LABELS[post.category] ?? post.category : ''}</Cat>
                    <Title>{post.title}</Title>
                    <Excerpt>{post.excerpt ?? ''}</Excerpt>
                  </Body>
                </Card>
              ))}
        </Row>
      </SectionInner>
    </Section>
  );
}
