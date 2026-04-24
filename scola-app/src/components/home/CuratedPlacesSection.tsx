'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import AutoCarousel from '@/components/ui/AutoCarousel';
import { Section, SectionInner, SectionHeader, SectionTitle, SectionMore } from '@/components/home/SectionLayout';
import PlaceCardItem, { SkeletonCard, SkeletonThumb, SkeletonBody, SkeletonLine } from '@/components/place/PlaceCardItem';
import api from '@/lib/api';
import type { Place, PlacesResponse } from '@/types/place';

export default function CuratedPlacesSection() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PlacesResponse>('/places', { params: { sort: 'daily', per: 12 } })
      .then((res) => setPlaces(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Section>
      <SectionInner>
        <SectionHeader>
          <SectionTitle>이번 주 추천 장소</SectionTitle>
          <SectionMore onClick={() => router.push('/search')}>
            전체보기 <ChevronRight size={15} />
          </SectionMore>
        </SectionHeader>
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
        ) : places.length === 0 ? null : (
          <AutoCarousel secPerItem={4}>
            {places.map((place) => (
              <PlaceCardItem key={place.id} place={place} onClick={() => router.push(`/place/${place.id}`)} />
            ))}
          </AutoCarousel>
        )}
      </SectionInner>
    </Section>
  );
}
