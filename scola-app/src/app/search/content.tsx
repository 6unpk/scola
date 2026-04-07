'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Star, MapPin, Clock, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Radio from '@/components/ui/Radio';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import api from '@/lib/api';
import type { Place, PlacesResponse } from '@/types/place';

const REGIONS = ['서울', '경기', '부산', '인천', '대구', '광주', '대전', '울산'];

// ─── Styled Components ────────────────────────────────────────────────────────

const PageWrap = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  display: flex;
  flex-direction: column;
`;

const SearchBar = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primaryDark};
  padding: 16px 20px;
`;

const SearchBarInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 480px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.1);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 16px;
  color: white;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: rgba(255,255,255,0.4); }
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const ResultCount = styled.p`
  font-size: 15px;
  color: rgba(255,255,255,0.5);
  margin-left: auto;
`;

const Body = styled.div`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 28px 20px;
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: sticky;
  top: 120px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    position: static;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const FilterTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ResetBtn = styled.button`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  &:hover { text-decoration: underline; }
`;

const FilterGroup = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: white;
  overflow: hidden;
  margin-bottom: 8px;
`;

const FilterGroupHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.gray100};
`;

const FilterGroupBody = styled.div`
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;


const ResultsArea = styled.div`flex: 1; min-width: 0;`;

const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ResultsTitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray600};
  strong { color: ${({ theme }) => theme.colors.dark}; font-weight: 700; }
`;


const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const PlaceCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const CardThumb = styled.div`
  height: 130px;
  overflow: hidden;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark};
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

const CardBody = styled.div`padding: 14px;`;

const CardName = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 4px;
`;

const CardAddr = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 10px;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
`;

const CardTag = styled.span`
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
`;

const CardPrice = styled.span<{ $range: string | null }>`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 11px;
  font-weight: 700;
  border: 1.5px solid;
  ${({ $range, theme }) =>
    $range === '저렴'
      ? `background: ${theme.colors.successLight}; border-color: ${theme.colors.success}; color: #15803d;`
      : $range === '고급'
      ? `background: ${theme.colors.primaryLight}; border-color: ${theme.colors.primary}; color: ${theme.colors.primary};`
      : `background: ${theme.colors.warningLight}; border-color: ${theme.colors.warning}; color: #92400e;`}
`;

const CardHours = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 8px;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 15px;
`;

const SkeletonCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const SkeletonThumb = styled.div`
  height: 130px;
  background: ${({ theme }) => theme.colors.gray100};
`;

const SkeletonBody = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonLine = styled.div<{ $w?: string }>`
  height: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.gray100};
  width: ${({ $w }) => $w ?? '100%'};
`;

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

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ $active, theme }) => $active ? 'white' : theme.colors.primary};
  }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

// ─── Filter Section ───────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('review');
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

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), per: '9', sort };
      if (query)        params.q            = query;
      if (category)     params.category     = category;
      if (region)       params.q            = (params.q ? params.q + ' ' : '') + region;
      if (is24hours)    params.is_24hours   = 'true';
      if (hasRestaurant) params.has_restaurant = 'true';
      if (hasSleepRoom)  params.has_sleep_room = 'true';
      if (hasMassage)    params.has_massage    = 'true';
      if (hasGym)        params.has_gym        = 'true';
      if (kidsFacility)  params.kids_facility  = 'true';

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

  // 필터 변경 시 페이지 리셋
  useEffect(() => { setPage(1); }, [query, category, region, sort, is24hours, hasRestaurant, hasSleepRoom, hasMassage, hasGym, kidsFacility]);

  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setRegion('');
    setSort('review');
    setIs24hours(false);
    setHasRestaurant(false);
    setHasSleepRoom(false);
    setHasMassage(false);
    setHasGym(false);
    setKidsFacility(false);
    setPage(1);
  };

  const displayAddr = (p: Place) => p.road_address ?? p.address ?? '';
  const displayTags = (p: Place) => p.tags?.length ? p.tags : (p.amenities ?? []);

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
        <Sidebar>
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
              { label: '24시간 운영', state: is24hours, set: setIs24hours },
              { label: '식당/매점', state: hasRestaurant, set: setHasRestaurant },
              { label: '수면실', state: hasSleepRoom, set: setHasSleepRoom },
              { label: '세신/마사지', state: hasMassage, set: setHasMassage },
              { label: '헬스장', state: hasGym, set: setHasGym },
              { label: '키즈 시설', state: kidsFacility, set: setKidsFacility },
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
            <Select
              value={sort}
              onChange={(v) => setSort(v)}
              options={[
                { value: 'review', label: '리뷰 많은 순' },
                { value: 'rating', label: '평점 높은 순' },
                { value: 'name', label: '이름 순' },
              ]}
            />
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
                    <CardAddr><MapPin size={11} />{displayAddr(place)}</CardAddr>
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
                return (
                  <PageBtn key={n} $active={n === page} onClick={() => setPage(n)}>{n}</PageBtn>
                );
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
