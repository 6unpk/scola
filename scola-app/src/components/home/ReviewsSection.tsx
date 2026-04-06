'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Star, ChevronRight } from 'lucide-react';
import AutoCarousel from '@/components/ui/AutoCarousel';
import { Section, SectionInner, SectionHeader, SectionTitle, SectionMore } from '@/components/home/SectionLayout';
import { RECENT_REVIEWS } from '@/data/home';

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
`;

const ReviewTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ReviewPlace = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  padding: 3px 8px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
`;

const ReviewStars = styled.div`
  display: flex;
  gap: 2px;
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

const ReviewAuthor = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
  font-weight: 500;
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewsSection() {
  const router = useRouter();

  return (
    <Section>
      <SectionInner>
        <SectionHeader>
          <SectionTitle>생생한 이용 후기</SectionTitle>
          <SectionMore onClick={() => router.push('/reviews')}>
            더보기 <ChevronRight size={15} />
          </SectionMore>
        </SectionHeader>
        <AutoCarousel duration={45}>
          {RECENT_REVIEWS.map((review) => (
            <ReviewCard key={review.id}>
              <ReviewTop>
                <ReviewPlace>{review.place_name}</ReviewPlace>
                <StarRating rating={review.rating} />
              </ReviewTop>
              <ReviewContent>"{review.content}"</ReviewContent>
              <ReviewAuthor>{review.author} · {review.created_at}</ReviewAuthor>
            </ReviewCard>
          ))}
        </AutoCarousel>
      </SectionInner>
    </Section>
  );
}
