'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Star, MapPin, Clock, ChevronRight } from 'lucide-react';
import AutoCarousel from '@/components/ui/AutoCarousel';
import { Section, SectionInner, SectionHeader, SectionTitle, SectionMore } from '@/components/home/SectionLayout';
import api from '@/lib/api';
import type { Place, PlacesResponse } from '@/types/place';

// ─── Styled Components ────────────────────────────────────────────────────────

const PlaceCard = styled.div`
  flex: 0 0 260px;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const PlaceThumbnail = styled.div`
  height: 140px;
  overflow: hidden;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark};
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

const PlaceBody = styled.div`padding: 14px;`;

const PlaceName = styled.h3`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 4px;
`;

const PlaceAddr = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 10px;
`;

const PlaceTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
`;

const PlaceTag = styled.span`
  padding: 3px 8px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const PlaceMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PlaceRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`;

const PlaceHours = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 8px;
`;

const SkeletonCard = styled.div`
  flex: 0 0 260px;
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const SkeletonThumb = styled.div`
  height: 140px;
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function CuratedPlacesSection() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PlacesResponse>('/places', { params: { sort: 'review', per: 12 } })
      .then((res) => setPlaces(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayTags = (p: Place) => p.tags?.length ? p.tags : (p.amenities ?? []);
  const displayAddr = (p: Place) => p.road_address ?? p.address ?? '';

  return (
    <Section>
      <SectionInner>
        <SectionHeader>
          <SectionTitle>이번 주 추천 장소</SectionTitle>
          <SectionMore onClick={() => router.push('/search')}>
            전체보기 <ChevronRight size={15} />
          </SectionMore>
        </SectionHeader>
        <AutoCarousel secPerItem={4}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i}>
                  <SkeletonThumb />
                  <SkeletonBody>
                    <SkeletonLine $w="70%" />
                    <SkeletonLine $w="50%" />
                    <SkeletonLine $w="90%" />
                  </SkeletonBody>
                </SkeletonCard>
              ))
            : places.map((place) => (
                <PlaceCard key={place.id} onClick={() => router.push(`/place/${place.id}`)}>
                  <PlaceThumbnail>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={place.thumbnail ?? `https://picsum.photos/seed/${place.naver_place_id}/400/200`}
                      alt={place.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${place.naver_place_id}/400/200`; }}
                    />
                  </PlaceThumbnail>
                  <PlaceBody>
                    <PlaceName>{place.name}</PlaceName>
                    <PlaceAddr><MapPin size={11} />{displayAddr(place)}</PlaceAddr>
                    <PlaceTags>
                      {displayTags(place).slice(0, 3).map((tag) => (
                        <PlaceTag key={tag}>{tag}</PlaceTag>
                      ))}
                    </PlaceTags>
                    <PlaceMeta>
                      <PlaceRating>
                        <Star size={13} fill="#EAB308" color="#EAB308" />
                        <span style={{ fontWeight: 400, color: '#9E9E9E', fontSize: 12 }}>
                          리뷰 {(place.visitor_review_count ?? 0).toLocaleString()}개
                        </span>
                      </PlaceRating>
                    </PlaceMeta>
                    {(place.open_hours ?? place.business_hours) && (
                      <PlaceHours>
                        <Clock size={11} />{place.open_hours ?? place.business_hours}
                      </PlaceHours>
                    )}
                  </PlaceBody>
                </PlaceCard>
              ))
          }
        </AutoCarousel>
      </SectionInner>
    </Section>
  );
}
