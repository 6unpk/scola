'use client';

import styled from 'styled-components';
import { Star, MapPin, Clock } from 'lucide-react';
import type { Place } from '@/types/place';

// ─── Styled ───────────────────────────────────────────────────────────────────

export const PlaceCard = styled.div`
  flex: 0 0 260px;
  min-width: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const PlaceThumbnail = styled.div`
  height: 140px;
  overflow: hidden;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark};
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

export const PlaceBody = styled.div`padding: 14px;`;

export const PlaceName = styled.h3`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PlaceAddr = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 10px;
  overflow: hidden;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const PlaceTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
`;

export const PlaceTag = styled.span`
  padding: 3px 8px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const PlaceMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PlaceRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`;

export const PlaceHours = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 8px;
`;

export const SkeletonCard = styled.div`
  flex: 0 0 260px;
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const SkeletonThumb = styled.div`
  height: 140px;
  background: ${({ theme }) => theme.colors.gray100};
`;

export const SkeletonBody = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SkeletonLine = styled.div<{ $w?: string }>`
  height: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.gray100};
  width: ${({ $w }) => $w ?? '100%'};
`;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  place: Place;
  onClick: () => void;
}

export default function PlaceCardItem({ place, onClick }: Props) {
  const tags = place.tags?.length ? place.tags : (place.amenities ?? []);
  const addr = place.road_address ?? place.address ?? '';

  return (
    <PlaceCard onClick={onClick}>
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
        <PlaceAddr><MapPin size={11} /><span>{addr}</span></PlaceAddr>
        <PlaceTags>
          {tags.slice(0, 3).map((tag) => <PlaceTag key={tag}>{tag}</PlaceTag>)}
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
  );
}
