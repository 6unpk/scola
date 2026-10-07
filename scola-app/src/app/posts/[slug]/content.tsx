'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft, Calendar, User, Eye, Heart, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LazyImage from '@/components/ui/LazyImage';
import PlaceCardItem from '@/components/place/PlaceCardItem';
import api from '@/lib/api';
import type { Post } from '@/types/post';
import type { Place, PlacesResponse } from '@/types/place';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// ─── Styled ───────────────────────────────────────────────────────────────────

const PageWrap = styled.div`min-height:100vh;background:${({ theme }) => theme.colors.gray50};display:flex;flex-direction:column;`;

const Hero = styled.div`width:100%;height:380px;overflow:hidden;position:relative;background:${({ theme }) => theme.colors.dark};`;
const HeroOverlay = styled.div`position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.75) 100%);`;
const HeroContent = styled.div`position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:24px 28px;max-width:860px;margin:0 auto;width:100%;`;
const BackBtn = styled.button`
  display:flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(0,0,0,0.4);
  border:1.5px solid rgba(255,255,255,0.25);border-radius:${({ theme }) => theme.radius.full};color:white;
  font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(8px);align-self:flex-start;transition:background 0.15s;
  &:hover{background:rgba(0,0,0,0.6);}
`;
const HeroMeta = styled.div`display:flex;flex-direction:column;gap:12px;`;
const HeroCat = styled.span`display:inline-block;padding:4px 12px;border-radius:${({ theme }) => theme.radius.full};background:${({ theme }) => theme.colors.primary};color:white;font-size:12px;font-weight:700;align-self:flex-start;`;
const HeroTitle = styled.h1`font-size:28px;font-weight:900;color:white;line-height:1.35;text-shadow:0 2px 10px rgba(0,0,0,0.4);@media (max-width:640px){font-size:22px;}`;
const HeroInfo = styled.div`display:flex;align-items:center;gap:16px;flex-wrap:wrap;`;
const HeroInfoItem = styled.span`display:flex;align-items:center;gap:5px;color:rgba(255,255,255,0.75);font-size:13px;`;

const ArticleWrap = styled.article`max-width:860px;margin:48px auto;padding:0 20px;flex:1;width:100%;`;

const Body = styled.div`
  background:white;border-radius:${({ theme }) => theme.radius.xl};padding:48px;
  border:1px solid ${({ theme }) => theme.colors.gray200};font-size:16px;line-height:1.8;color:${({ theme }) => theme.colors.dark};
  @media (max-width:640px){padding:28px 20px;font-size:15px;}
  h1,h2,h3,h4{font-weight:800;margin:2em 0 0.6em;line-height:1.3;color:${({ theme }) => theme.colors.dark};}
  h1{font-size:1.6em;}
  h2{font-size:1.3em;padding-bottom:10px;border-bottom:2px solid ${({ theme }) => theme.colors.gray200};}
  h3{font-size:1.1em;}
  p{margin:1em 0;}
  a{color:${({ theme }) => theme.colors.primary};text-decoration:underline;text-underline-offset:3px;}
  blockquote{margin:1.5em 0;padding:16px 20px;border-left:4px solid ${({ theme }) => theme.colors.primary};background:${({ theme }) => theme.colors.gray50};border-radius:0 ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0;font-style:italic;color:${({ theme }) => theme.colors.gray500};}
  ul,ol{padding-left:1.5em;margin:1em 0;li{margin:0.4em 0;}}
  code{font-family:'Courier New',monospace;font-size:0.88em;background:${({ theme }) => theme.colors.gray100};padding:2px 6px;border-radius:4px;color:${({ theme }) => theme.colors.primary};}
  pre{background:${({ theme }) => theme.colors.dark};border-radius:${({ theme }) => theme.radius.md};padding:20px;overflow-x:auto;margin:1.5em 0;code{background:none;color:#e0e0e0;padding:0;font-size:0.9em;}}
  img{display:block;max-width:100%;border-radius:${({ theme }) => theme.radius.lg};margin:1.5em auto;}
  hr{border:none;border-top:1.5px solid ${({ theme }) => theme.colors.gray200};margin:2em 0;}
  table{width:100%;border-collapse:collapse;margin:1.5em 0;font-size:0.93em;th,td{border:1px solid ${({ theme }) => theme.colors.gray200};padding:10px 14px;text-align:left;}th{background:${({ theme }) => theme.colors.gray50};font-weight:700;}}
  strong{font-weight:800;}
`;

const PlaceholderHero = styled.div`width:100%;height:380px;background:linear-gradient(135deg,${({ theme }) => theme.colors.dark} 0%,#2a2a2a 100%);position:relative;`;

const LikeRow = styled.div`display:flex;justify-content:center;margin:28px 0 8px;`;
const LikeBtn = styled.button<{ $liked: boolean }>`
  display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:${({ theme }) => theme.radius.full};
  border:2px solid ${({ $liked, theme }) => ($liked ? theme.colors.primary : theme.colors.gray200)};
  background:${({ $liked, theme }) => ($liked ? theme.colors.primaryLight : theme.colors.white)};
  color:${({ $liked, theme }) => ($liked ? theme.colors.primary : theme.colors.gray700)};
  font-size:15px;font-weight:800;cursor:pointer;transition:all 0.15s;
  &:hover{border-color:${({ theme }) => theme.colors.primary};color:${({ theme }) => theme.colors.primary};}
  svg{fill:${({ $liked }) => ($liked ? 'currentColor' : 'none')};}
`;
const RecoSection = styled.section`margin-top:40px;`;
const RecoTitle = styled.h2`font-size:18px;font-weight:900;color:${({ theme }) => theme.colors.dark};margin-bottom:16px;`;
const RecoGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;@media (max-width:760px){grid-template-columns:minmax(0,1fr);}`;
const CtaBtn = styled.button`
  width:100%;margin-top:20px;display:flex;align-items:center;justify-content:center;gap:8px;padding:16px;
  background:${({ theme }) => theme.colors.primary};color:#fff;border:none;border-radius:${({ theme }) => theme.radius.lg};
  font-size:16px;font-weight:800;cursor:pointer;&:hover{opacity:0.92;}
`;

const CAT_LABELS: Record<string, string> = {
  sauna: '사우나 이야기', wellness: '건강 & 웰빙', travel: '여행 & 지역', guide: '가이드', etc: '기타',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostContent({ post }: { post: Post }) {
  const router = useRouter();
  useEffect(() => { api.post(`/posts/${post.slug}/view`).catch(() => {}); }, [post.slug]);
  const formatDate = (d: string | null) => (d ? format(new Date(d), 'yyyy년 M월 d일', { locale: ko }) : '');

  const likeKey = `scola-liked-${post.slug}`;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes ?? 0);
  useEffect(() => {
    try { setLiked(localStorage.getItem(likeKey) === '1'); } catch {}
  }, [likeKey]);
  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    try { localStorage.setItem(likeKey, '1'); } catch {}
    api.post(`/posts/${post.slug}/like`).catch(() => {});
  };

  const [reco, setReco] = useState<Place[]>([]);
  useEffect(() => {
    api.get<PlacesResponse>('/places', { params: { sort: 'recommend', per: 3, has_image: 'true' } })
      .then((res) => setReco(res.data.data))
      .catch(() => {});
  }, []);

  const heroMeta = (
    <HeroMeta>
      {post.category && <HeroCat>{CAT_LABELS[post.category] ?? post.category}</HeroCat>}
      <HeroTitle>{post.title}</HeroTitle>
      <HeroInfo>
        <HeroInfoItem><User size={13} />{post.author_name}</HeroInfoItem>
        <HeroInfoItem><Calendar size={13} />{formatDate(post.published_at)}</HeroInfoItem>
        <HeroInfoItem><Eye size={13} />{(post.views ?? 0).toLocaleString()}</HeroInfoItem>
      </HeroInfo>
    </HeroMeta>
  );

  const back = (
    <BackBtn onClick={() => router.push('/posts')}>
      <ArrowLeft size={14} /> 목록으로
    </BackBtn>
  );

  return (
    <PageWrap>
      <Navbar />

      {post.thumbnail ? (
        <Hero>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.75 }}>
            <LazyImage src={post.thumbnail} alt={post.title} />
          </div>
          <HeroOverlay />
          <HeroContent>{back}{heroMeta}</HeroContent>
        </Hero>
      ) : (
        <PlaceholderHero>
          <HeroContent>{back}{heroMeta}</HeroContent>
        </PlaceholderHero>
      )}

      <ArticleWrap>
        <Body>
          {post.body ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          ) : (
            <p style={{ color: '#9E9E9E', textAlign: 'center', padding: '40px 0' }}>내용이 없습니다.</p>
          )}
        </Body>

        <LikeRow>
          <LikeBtn $liked={liked} onClick={handleLike}>
            <Heart size={18} />
            {liked ? '도움이 됐어요!' : '이 글이 도움이 됐나요?'}
            {likes > 0 && <span>{likes.toLocaleString()}</span>}
          </LikeBtn>
        </LikeRow>

        {reco.length > 0 && (
          <RecoSection>
            <RecoTitle>스콜라 추천 사우나</RecoTitle>
            <RecoGrid>
              {reco.map((p) => (
                <PlaceCardItem key={p.id} place={p} onClick={() => router.push(`/place/${p.id}`)} />
              ))}
            </RecoGrid>
          </RecoSection>
        )}
        <CtaBtn onClick={() => router.push('/map')}>
          <MapPin size={18} /> 내 주변 사우나·찜질방 찾기
        </CtaBtn>
      </ArticleWrap>

      <Footer />
    </PageWrap>
  );
}
