'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiStarFill, RiStarLine, RiUserLine, RiMapPin2Line,
  RiCalendarLine, RiArrowLeftLine, RiArrowRightLine,
} from '@remixicon/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import LazyImage from '@/components/ui/LazyImage';
import {
  PageWrap, Header, HeaderInner, HeaderLeft, HeaderKicker, HeaderTitle, HeaderStat,
  Body, Grid, ReviewCard, CardTop, PlaceThumb, PlaceInfo, PlaceName, PlaceAddr, Stars,
  CardBody, ReviewText, CardMeta, UserInfo, Avatar, UserName, DateInfo,
  SkeletonCard, SkeletonThumb, SkeletonLine, Pagination, PageBtn, EmptyState,
} from './styles';

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
    place.thumbnail ?? '/place-placeholder.svg';

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
          <Select
            variant="dark"
            value={sort}
            onChange={(v) => setSort(v as 'latest' | 'rating')}
            options={[
              { value: 'latest', label: '최신순' },
              { value: 'rating', label: '별점 높은 순' },
            ]}
          />
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
                    <LazyImage
                      src={getThumb(r.place)}
                      alt={r.place.name}
                      fallback="/place-placeholder.svg"
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
