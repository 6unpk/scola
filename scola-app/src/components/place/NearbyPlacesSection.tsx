'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ChevronRight } from 'lucide-react';
import AutoCarousel from '@/components/ui/AutoCarousel';
import PlaceCardItem, { SkeletonCard, SkeletonThumb, SkeletonBody, SkeletonLine } from '@/components/place/PlaceCardItem';
import api from '@/lib/api';
import type { Place, PlacesResponse } from '@/types/place';

// ─── 지역 추출 ────────────────────────────────────────────────────────────────

const ADDRESS_TO_REGION: [string, string][] = [
  ['서울특별시', '서울'], ['부산광역시', '부산'], ['인천광역시', '인천'],
  ['대구광역시', '대구'], ['광주광역시', '광주'], ['대전광역시', '대전'],
  ['울산광역시', '울산'], ['세종특별자치시', '세종'], ['경기도', '경기'],
  ['강원특별자치도', '강원'], ['충청북도', '충북'], ['충청남도', '충남'],
  ['전북특별자치도', '전북'], ['전라남도', '전남'], ['경상북도', '경북'],
  ['경상남도', '경남'], ['제주특별자치도', '제주'],
];

function extractRegion(address: string | null): string {
  if (!address) return '';
  for (const [full, short] of ADDRESS_TO_REGION) {
    if (address.startsWith(full)) return short;
  }
  return '';
}

function regionLabel(short: string): string {
  const full = ADDRESS_TO_REGION.find(([, s]) => s === short)?.[0] ?? short;
  return full.replace(/특별시|광역시|특별자치시|특별자치도|도$/, '');
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const Section = styled.section`
  padding: 0 0 64px;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
`;

const MoreBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  currentPlaceId: number;
  address: string | null;
}

export default function NearbyPlacesSection({ currentPlaceId, address }: Props) {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const region = extractRegion(address);

  useEffect(() => {
    if (!region) { setLoading(false); return; }

    api.get<PlacesResponse>('/places', { params: { region, per: '9', sort: 'review' } })
      .then((res) => {
        setPlaces(res.data.data.filter((p) => p.id !== currentPlaceId).slice(0, 8));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [region, currentPlaceId]);

  if (!loading && places.length === 0) return null;

  return (
    <Section>
      <Inner>
        <Header>
          <Title>{regionLabel(region)} 지역의 다른 장소</Title>
          <MoreBtn onClick={() => router.push(`/search?region=${region}`)}>
            전체보기 <ChevronRight size={15} />
          </MoreBtn>
        </Header>
      </Inner>
      <div style={{ padding: '0 20px', maxWidth: 1100, margin: '0 auto' }}>
        {loading ? (
          <AutoCarousel secPerItem={4}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i}>
                <SkeletonThumb />
                <SkeletonBody>
                  <SkeletonLine $w="70%" />
                  <SkeletonLine $w="50%" />
                  <SkeletonLine $w="90%" />
                </SkeletonBody>
              </SkeletonCard>
            ))}
          </AutoCarousel>
        ) : (
          <AutoCarousel secPerItem={4}>
            {places.map((place) => (
              <PlaceCardItem key={place.id} place={place} onClick={() => router.push(`/place/${place.id}`)} />
            ))}
          </AutoCarousel>
        )}
      </div>
    </Section>
  );
}
