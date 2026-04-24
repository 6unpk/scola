'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, MapPin, Clock, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Radio from '@/components/ui/Radio';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import type { Place, PlacesResponse } from '@/types/place';
import {
  PageWrap, SearchBar, SearchBarInner, SearchInput, ResultCount,
  Body, Sidebar, FilterHeader, FilterTitle, ResetBtn,
  FilterGroup, FilterGroupHeader, FilterGroupBody,
  ResultsArea, MobileToolbar, MobileFilterBtn,
  ResultsHeader, ResultsTitle, DesktopSort,
  Grid, PlaceCard, CardThumb, CardBody, CardName, CardAddr,
  CardTags, CardTag, CardMeta, CardRating, CardHours,
  EmptyState, SkeletonCard, SkeletonThumb, SkeletonBody, SkeletonLine,
  Pagination, PageBtn,
} from './styles';

const REGIONS = [
  '서울', '부산', '인천', '대구', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

// ─── FilterSection ────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <FilterGroup>
      <FilterGroupHeader onClick={() => setOpen((p) => !p)}>
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </FilterGroupHeader>
      {open && <FilterGroupBody>{children}</FilterGroupBody>}
    </FilterGroup>
  );
}

// ─── SearchContent ────────────────────────────────────────────────────────────

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('popular');
  const [is24hours, setIs24hours] = useState(false);
  const [hasRestaurant, setHasRestaurant] = useState(false);
  const [hasSleepRoom, setHasSleepRoom] = useState(false);
  const [hasMassage, setHasMassage] = useState(false);
  const [hasGym, setHasGym] = useState(false);
  const [kidsFacility, setKidsFacility] = useState(false);
  const [page, setPage] = useState(1);

  const [places, setPlaces] = useState<Place[]>([]);
  const [meta, setMeta] = useState({ total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), per: '9', sort };
      if (query)         params.q               = query;
      if (category)      params.category        = category;
      if (region)        params.region          = region;
      if (is24hours)     params.is_24hours      = 'true';
      if (hasRestaurant) params.has_restaurant  = 'true';
      if (hasSleepRoom)  params.has_sleep_room  = 'true';
      if (hasMassage)    params.has_massage     = 'true';
      if (hasGym)        params.has_gym         = 'true';
      if (kidsFacility)  params.kids_facility   = 'true';

      const res = await api.get<PlacesResponse>('/places', { params });
      setPlaces(res.data.data);
      setMeta(res.data.meta);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [query, category, region, sort, is24hours, hasRestaurant, hasSleepRoom, hasMassage, hasGym, kidsFacility, page]);

  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);
  useEffect(() => { setPage(1); }, [query, category, region, sort, is24hours, hasRestaurant, hasSleepRoom, hasMassage, hasGym, kidsFacility]);

  const resetFilters = () => {
    setQuery(''); setCategory(''); setRegion(''); setSort('review');
    setIs24hours(false); setHasRestaurant(false); setHasSleepRoom(false);
    setHasMassage(false); setHasGym(false); setKidsFacility(false);
    setPage(1);
  };

  const displayAddr = (p: Place) => p.road_address ?? p.address ?? '';
  const displayTags = (p: Place) => p.tags?.length ? p.tags : (p.amenities ?? []);
  const activeFilterCount = [category, region, is24hours, hasRestaurant, hasSleepRoom, hasMassage, hasGym, kidsFacility]
    .filter(Boolean).length;

  const sortOptions = [
    { value: 'popular', label: '인기순' },
    { value: 'rating',  label: '평점 높은 순' },
    { value: 'recent',  label: '최신순' },
  ];

  return (
    <PageWrap>
      <Navbar />

      <SearchBar>
        <SearchBarInner>
          <SearchInput
            placeholder="사우나, 찜질방, 지역 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ResultCount>
            총 <strong style={{ color: 'white' }}>{meta.total.toLocaleString()}개</strong>의 결과
          </ResultCount>
        </SearchBarInner>
      </SearchBar>

      <Body>
        {/* 모바일 전용: 필터 토글 + 정렬 */}
        <MobileToolbar>
          <MobileFilterBtn
            $active={mobileFiltersOpen || activeFilterCount > 0}
            onClick={() => setMobileFiltersOpen((p) => !p)}
          >
            <SlidersHorizontal size={14} />
            필터{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </MobileFilterBtn>
          <div style={{ flex: 1 }} />
          <Select value={sort} onChange={setSort} options={sortOptions} />
        </MobileToolbar>

        <Sidebar $mobileOpen={mobileFiltersOpen}>
          <FilterHeader>
            <FilterTitle><SlidersHorizontal size={15} /> 필터</FilterTitle>
            <ResetBtn onClick={resetFilters}><X size={12} /> 초기화</ResetBtn>
          </FilterHeader>

          <FilterSection title="카테고리">
            {[
              { value: '', label: '전체' },
              { value: 'sauna', label: '사우나' },
              { value: 'jjimjilbang', label: '찜질방' },
              { value: 'spa', label: '스파' },
              { value: 'seshin', label: '세신샵' },
              { value: 'hotel', label: '호텔' },
              { value: 'waterpark', label: '워터파크' },
            ].map((opt) => (
              <Radio key={opt.value} name="category" value={opt.value} checked={category === opt.value} onChange={setCategory} label={opt.label} />
            ))}
          </FilterSection>

          <FilterSection title="지역">
            {REGIONS.map((r) => (
              <Radio key={r} name="region" value={r} checked={region === r} onChange={(v) => setRegion(region === v ? '' : v)} label={r} />
            ))}
          </FilterSection>

          <FilterSection title="운영 조건">
            {[
              { label: '24시간 운영', state: is24hours,    set: setIs24hours },
              { label: '식당/매점',   state: hasRestaurant, set: setHasRestaurant },
              { label: '수면실',      state: hasSleepRoom,  set: setHasSleepRoom },
              { label: '세신/마사지', state: hasMassage,    set: setHasMassage },
              { label: '헬스장',      state: hasGym,        set: setHasGym },
              { label: '키즈 시설',   state: kidsFacility,  set: setKidsFacility },
            ].map(({ label, state, set }) => (
              <Checkbox key={label} checked={state} onChange={set} label={label} />
            ))}
          </FilterSection>
        </Sidebar>

        <ResultsArea>
          <ResultsHeader>
            <ResultsTitle>
              <strong>{meta.total.toLocaleString()}개</strong>의 장소를 찾았습니다
            </ResultsTitle>
            <DesktopSort>
              <Select value={sort} onChange={setSort} options={sortOptions} />
            </DesktopSort>
          </ResultsHeader>

          <Grid>
            {loading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i}>
                  <SkeletonThumb />
                  <SkeletonBody>
                    <SkeletonLine $w="70%" />
                    <SkeletonLine $w="50%" />
                    <SkeletonLine $w="90%" />
                  </SkeletonBody>
                </SkeletonCard>
              ))
            ) : places.length === 0 ? (
              <EmptyState>조건에 맞는 장소가 없습니다.</EmptyState>
            ) : (
              places.map((place) => (
                <PlaceCard key={place.id} onClick={() => router.push(`/place/${place.id}`)}>
                  <CardThumb>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={place.thumbnail ?? `https://picsum.photos/seed/${place.naver_place_id}/400/200`}
                      alt={place.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${place.naver_place_id}/400/200`; }}
                    />
                  </CardThumb>
                  <CardBody>
                    <CardName>{place.name}</CardName>
                    <CardAddr><MapPin size={11} /><span>{displayAddr(place)}</span></CardAddr>
                    <CardTags>
                      {displayTags(place).slice(0, 3).map((tag) => (
                        <CardTag key={tag}>{tag}</CardTag>
                      ))}
                    </CardTags>
                    <CardMeta>
                      <CardRating>
                        {place.rating ? (
                          <>
                            <Star size={13} fill="#EAB308" color="#EAB308" />
                            {place.rating}
                            <span style={{ fontWeight: 400, color: '#9E9E9E', fontSize: 12 }}>
                              ({(place.review_count ?? place.visitor_review_count ?? 0).toLocaleString()})
                            </span>
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: '#9E9E9E' }}>
                            리뷰 {(place.visitor_review_count ?? 0).toLocaleString()}개
                          </span>
                        )}
                      </CardRating>
                    </CardMeta>
                    {(place.open_hours ?? place.business_hours) && (
                      <CardHours>
                        <Clock size={11} />{place.open_hours ?? place.business_hours}
                      </CardHours>
                    )}
                  </CardBody>
                </PlaceCard>
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
        </ResultsArea>
      </Body>

      <Footer />
    </PageWrap>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
