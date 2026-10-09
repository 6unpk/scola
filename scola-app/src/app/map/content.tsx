'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import PlacesMap, { CATEGORY_META } from '@/components/map/PlacesMap';
import { useNaverMaps } from '@/components/map/useNaverMaps';
import { REGIONS } from '@/data/regions';
import api from '@/lib/api';
import type { PlaceMarker } from '@/types/place';
import {
  PageWrap, MapBody, ControlPanel, PanelTitle, PanelIntro, SearchInput,
  ChipGroup, Chip, ChipDot, ResultCount, MapColumn, MapArea, MapFallback, FieldLabel,
  RegionLinks, RegionLink, PanelTop, FilterToggle, FilterBody,
  RecoStrip, RecoTitle, RecoRow, RecoCard, RecoText, RecoName, RecoSub,
} from './styles';

function recoSub(p: PlaceMarker) {
  const cat = CATEGORY_META.find((c) => p.app_category?.includes(c.value))?.label;
  const town = p.road_address?.split(' ').slice(0, 2).join(' ');
  return [cat, town].filter(Boolean).join(' · ');
}

export default function MapContent({ recommended }: { recommended: PlaceMarker[] }) {
  const [focus, setFocus] = useState<{ place: PlaceMarker; seq: number } | null>(null);
  const { ready, error, hasKey } = useNaverMaps();

  const [markers, setMarkers] = useState<PlaceMarker[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false); // 모바일 필터 접기 (데스크톱은 항상 표시)

  // 마커 전량 1회 로드 → 필터는 클라이언트에서 처리(즉각)
  useEffect(() => {
    let active = true;
    api.get<{ data: PlaceMarker[] }>('/places/markers')
      .then((res) => { if (active) setMarkers(res.data.data ?? []); })
      .catch(() => { /* 지도는 부가 기능이므로 조용히 무시 */ });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return markers.filter((m) => {
      const catOk = category.length === 0 || m.app_category?.some((c) => category.includes(c));
      const qOk = !q || m.name.toLowerCase().includes(q) || (m.road_address ?? '').toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [markers, category, query]);

  const toggleCategory = (v: string) =>
    setCategory((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  return (
    <PageWrap>
      <Navbar />
      <MapBody>
        <ControlPanel>
          <PanelTitle>전국 사우나·찜질방 지도</PanelTitle>
          <PanelIntro>
            전국 3,000여 곳의 사우나·찜질방·목욕탕·온천을 지도에서 찾아보세요. 지역을 고르면 시군구별 추천 목록으로 이동합니다.
          </PanelIntro>

          <PanelTop>
            <SearchInput
              placeholder="이름 또는 지역으로 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FilterToggle
              $open={filtersOpen}
              onClick={() => setFiltersOpen((p) => !p)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={14} />
              필터{category.length > 0 ? ` ${category.length}` : ''}
            </FilterToggle>
          </PanelTop>

          <FilterBody $open={filtersOpen}>
            <div>
              <FieldLabel style={{ marginBottom: 10 }}>카테고리</FieldLabel>
              <ChipGroup>
                {CATEGORY_META.map((c) => (
                  <Chip
                    key={c.value}
                    $active={category.includes(c.value)}
                    onClick={() => toggleCategory(c.value)}
                  >
                    <ChipDot style={{ background: c.color }} />
                    {c.label}
                  </Chip>
                ))}
              </ChipGroup>
            </div>

            <div>
              <FieldLabel style={{ marginBottom: 10 }}>지역별 보기</FieldLabel>
              <RegionLinks>
                {REGIONS.map((r) => (
                  <RegionLink key={r.slug} href={`/sauna/${r.slug}`}>{r.name}</RegionLink>
                ))}
              </RegionLinks>
            </div>
          </FilterBody>

          {markers.length > 0 && (
            <ResultCount>
              지도에 <strong>{filtered.length.toLocaleString()}곳</strong> 표시 중
            </ResultCount>
          )}
        </ControlPanel>

        <MapColumn>
          <MapArea>
            {!hasKey ? (
              <MapFallback>
                <MapPin size={28} />
                <strong>지도를 불러올 수 없습니다</strong>
                <span>지도 API 키(NEXT_PUBLIC_NAVER_MAP_KEY_ID)가 설정되지 않았습니다.</span>
              </MapFallback>
            ) : error ? (
              <MapFallback>
                <MapPin size={28} />
                <strong>지도를 불러오지 못했습니다</strong>
                <span>잠시 후 다시 시도해주세요.</span>
              </MapFallback>
            ) : (
              <PlacesMap places={filtered} ready={ready} focus={focus} />
            )}
          </MapArea>

          {recommended.length > 0 && (
            <RecoStrip>
              <RecoTitle>스콜라 추천 사우나·찜질방</RecoTitle>
              <RecoRow>
                {recommended.map((p) => (
                  <RecoCard
                    key={p.id}
                    href={`/place/${p.id}`}
                    onClick={(e) => {
                      if (!ready) return;
                      e.preventDefault();
                      setFocus((f) => ({ place: p, seq: (f?.seq ?? 0) + 1 }));
                    }}
                  >
                    <img src={p.thumbnail ?? '/place-placeholder.svg'} alt="" loading="lazy" />
                    <RecoText>
                      <RecoName>{p.name}</RecoName>
                      <RecoSub>{recoSub(p)}</RecoSub>
                    </RecoText>
                  </RecoCard>
                ))}
              </RecoRow>
            </RecoStrip>
          )}
        </MapColumn>
      </MapBody>
    </PageWrap>
  );
}
