'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import {
  RiStarFill, RiStarLine, RiUserLine, RiMapPin2Line,
  RiCalendarLine, RiArrowLeftLine, RiArrowRightLine,
} from '@remixicon/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewPlace {
  id: number;
  name: string;
  thumbnail: string | null;
  road_address: string | null;
  address: string | null;
  naver_place_id: string | null;
}

interface Review {
  id: number;
  body: string;
  rating: number;
  visited_at: string | null;
  created_at: string;
  user: { id: number; nickname: string };
  place: ReviewPlace;
}

interface ReviewsMeta {
  total: number;
  total_pages: number;
  page: number;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const PageWrap = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primaryDark};
  padding: 36px 20px 28px;
`;

const HeaderInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div``;

const HeaderKicker = styled.p`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const HeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: white;
  line-height: 1.2;
`;

const HeaderStat = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.4);
  margin-top: 6px;
  strong { color: rgba(255,255,255,0.8); font-weight: 700; }
`;

const SortSelect = styled.select`
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(255,255,255,0.08);
  border: 1.5px solid rgba(255,255,255,0.15);
  border-radius: ${({ theme }) => theme.radius.md};
  color: rgba(255,255,255,0.75);
  outline: none;
  cursor: pointer;

  option { background: #1a1a1a; color: white; }
`;

const Body = styled.div`
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  padding: 28px 20px 64px;
`;

// ── 카드 ──
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CardTop = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

const PlaceThumb = styled.div`
  width: 90px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.gray100};
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

const PlaceInfo = styled.div`
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
`;

const PlaceName = styled.button`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const PlaceAddr = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
  margin-top: 2px;
`;

const CardBody = styled.div`padding: 16px;`;

const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const Avatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const UserName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
`;

// ── 스켈레톤 ──
const SkeletonCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const SkeletonThumb = styled.div`width: 90px; height: 90px; background: ${({ theme }) => theme.colors.gray100};`;

const SkeletonLine = styled.div<{ $w?: string; $h?: string }>`
  height: ${({ $h }) => $h ?? '13px'};
  width: ${({ $w }) => $w ?? '100%'};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.gray100};
`;

// ── 페이지네이션 ──
const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 32px;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.dark};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'white'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.dark};
  cursor: ${({ $active }) => $active ? 'default' : 'pointer'};
  transition: all 0.15s;
  &:hover:not(:disabled) { border-color: ${({ theme }) => theme.colors.primary}; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.gray400};
`;

// ─── Component ────────────────────────────────────────────────────────────────

function ReviewsContent() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<ReviewsMeta>({ total: 0, total_pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'latest' | 'rating'>('latest');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews', { params: { page, per: 12, sort } });
      setReviews(res.data.data);
      setMeta(res.data.meta);
    } finally {
      setLoading(false);
    }
  }, [page, sort]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);
  useEffect(() => { setPage(1); }, [sort]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const getThumb = (place: ReviewPlace) =>
    place.thumbnail ?? `https://picsum.photos/seed/${place.naver_place_id ?? place.id}/200/200`;

  const getAddr = (place: ReviewPlace) => place.road_address ?? place.address ?? '';

  return (
    <PageWrap>
      <Navbar />

      <Header>
        <HeaderInner>
          <HeaderLeft>
            <HeaderKicker>Community Reviews</HeaderKicker>
            <HeaderTitle>이용 후기</HeaderTitle>
            {!loading && (
              <HeaderStat>총 <strong>{meta.total.toLocaleString()}개</strong>의 후기</HeaderStat>
            )}
          </HeaderLeft>
          <SortSelect value={sort} onChange={(e) => setSort(e.target.value as 'latest' | 'rating')}>
            <option value="latest">최신순</option>
            <option value="rating">별점 높은 순</option>
          </SortSelect>
        </HeaderInner>
      </Header>

      <Body>
        <Grid>
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i}>
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                  <SkeletonThumb />
                  <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <SkeletonLine $w="60%" />
                    <SkeletonLine $w="80%" />
                  </div>
                </div>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <SkeletonLine />
                  <SkeletonLine $w="90%" />
                  <SkeletonLine $w="40%" />
                </div>
              </SkeletonCard>
            ))
          ) : reviews.length === 0 ? (
            <EmptyState>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>아직 후기가 없습니다.</p>
              <p style={{ fontSize: 14 }}>사우나를 방문하고 첫 후기를 남겨보세요!</p>
            </EmptyState>
          ) : (
            reviews.map((r) => (
              <ReviewCard key={r.id}>
                <CardTop>
                  <PlaceThumb>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getThumb(r.place)}
                      alt={r.place.name}
                      style={{ height: '100%', minHeight: 90 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://picsum.photos/seed/${r.place.id}/200/200`;
                      }}
                    />
                  </PlaceThumb>
                  <PlaceInfo>
                    <PlaceName onClick={() => router.push(`/place/${r.place.id}`)}>
                      {r.place.name}
                    </PlaceName>
                    {getAddr(r.place) && (
                      <PlaceAddr>
                        <RiMapPin2Line size={11} />
                        {getAddr(r.place)}
                      </PlaceAddr>
                    )}
                    <Stars>
                      {[1,2,3,4,5].map((n) =>
                        n <= r.rating
                          ? <RiStarFill key={n} size={13} color="#EAB308" />
                          : <RiStarLine key={n} size={13} color="#D1D5DB" />
                      )}
                    </Stars>
                  </PlaceInfo>
                </CardTop>

                <CardBody>
                  <ReviewText>{r.body}</ReviewText>
                  <CardMeta>
                    <UserInfo>
                      <Avatar><RiUserLine size={13} /></Avatar>
                      <UserName>{r.user.nickname}</UserName>
                    </UserInfo>
                    <DateInfo>
                      <RiCalendarLine size={12} />
                      {r.visited_at
                        ? `${new Date(r.visited_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })} 방문`
                        : formatDate(r.created_at)}
                    </DateInfo>
                  </CardMeta>
                </CardBody>
              </ReviewCard>
            ))
          )}
        </Grid>

        {meta.total_pages > 1 && (
          <Pagination>
            <PageBtn onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
              <RiArrowLeftLine size={14} />
            </PageBtn>
            {Array.from({ length: Math.min(meta.total_pages, 10) }, (_, i) => {
              const n = Math.max(1, Math.min(page - 4, meta.total_pages - 9)) + i;
              return (
                <PageBtn key={n} $active={n === page} onClick={() => setPage(n)}>{n}</PageBtn>
              );
            })}
            <PageBtn onClick={() => setPage((p) => p + 1)} disabled={page === meta.total_pages}>
              <RiArrowRightLine size={14} />
            </PageBtn>
          </Pagination>
        )}
      </Body>

      <Footer />
    </PageWrap>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={null}>
      <ReviewsContent />
    </Suspense>
  );
}
