'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Star } from 'lucide-react';
import AutoCarousel from '@/components/ui/AutoCarousel';
import { Section, SectionInner, SectionHeader, SectionTitle } from '@/components/home/SectionLayout';
import api from '@/lib/api';
import type { Place } from '@/types/place';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NaverReview {
  key: string;
  place_id: number;
  place_name: string;
  rating: number | null;
  content: string;
}

// ─── Styled Components ────────────────────────────────────────────────────────

const ReviewCard = styled.div`
  flex: 0 0 300px;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.15s;
  &:hover { transform: translateY(-2px); }
`;

const ReviewTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ReviewPlace = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  padding: 3px 8px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

const ReviewStars = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
`;

const ReviewContent = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray700};
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReviewSource = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const NaverBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background: #03C75A;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <ReviewStars>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          fill={i <= Math.round(rating) ? '#EAB308' : 'none'}
          color={i <= Math.round(rating) ? '#EAB308' : '#D1D5DB'}
        />
      ))}
    </ReviewStars>
  );
}

// 여러 장소의 대표 네이버 후기를 카드용 목록으로 평탄화.
// 특정 장소가 목록을 독식하지 않도록 장소당 최대 2개까지만 사용.
function buildReviews(places: Place[]): NaverReview[] {
  const out: NaverReview[] = [];
  for (const place of places) {
    const reps = place.review_summary?.representative_reviews ?? [];
    reps.slice(0, 2).forEach((content, idx) => {
      const text = content?.trim();
      if (!text || text.length < 15) return;
      out.push({
        key: `${place.id}-${idx}`,
        place_id: place.id,
        place_name: place.name,
        rating: place.rating,
        content: text,
      });
    });
  }
  return out.slice(0, 16);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewsSection() {
  const router = useRouter();
  const [reviews, setReviews] = useState<NaverReview[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get('/places', { params: { sort: 'popular', per: 40 } });
        if (active) setReviews(buildReviews(res.data.data ?? []));
      } catch {
        /* 후기 섹션은 부가 콘텐츠이므로 실패해도 조용히 넘어감 */
      }
    })();
    return () => { active = false; };
  }, []);

  if (reviews.length === 0) return null;

  return (
    <Section>
      <SectionInner>
        <SectionHeader>
          <SectionTitle>생생한 이용 후기</SectionTitle>
        </SectionHeader>
        <AutoCarousel duration={45}>
          {reviews.map((review) => (
            <ReviewCard key={review.key} onClick={() => router.push(`/place/${review.place_id}`)}>
              <ReviewTop>
                <ReviewPlace>{review.place_name}</ReviewPlace>
                {review.rating != null && <StarRating rating={review.rating} />}
              </ReviewTop>
              <ReviewContent>"{review.content}"</ReviewContent>
              <ReviewSource>
                <NaverBadge>N</NaverBadge>
                네이버 방문자 리뷰
              </ReviewSource>
            </ReviewCard>
          ))}
        </AutoCarousel>
      </SectionInner>
    </Section>
  );
}
