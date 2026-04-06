'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { RiSteamLine } from '@remixicon/react';
import { Section, SectionInner } from '@/components/home/SectionLayout';

// ─── Styled Components ────────────────────────────────────────────────────────

const GuideCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.dark};
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 40px 48px;
  cursor: pointer;
  transition: border-color 0.15s;
  overflow: hidden;
  position: relative;

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 28px 24px;
  }
`;

const GuideLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1;
`;

const GuideBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.full};
  width: fit-content;
  letter-spacing: 0.5px;
`;

const GuideTitle = styled.h3`
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.2;
`;

const GuideDesc = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.55);
  line-height: 1.7;
`;

const GuideLink = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const GuideRight = styled.div`
  flex-shrink: 0;
  z-index: 1;
`;

const GuideEmoji = styled.div`
  font-size: 96px;
  line-height: 1;
  opacity: 0.85;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuideBannerSection() {
  const router = useRouter();

  return (
    <Section>
      <SectionInner>
        <GuideCard onClick={() => router.push('/guide')}>
          <GuideLeft>
            <GuideBadge>가이드</GuideBadge>
            <GuideTitle>사우나, 제대로 즐기는 법</GuideTitle>
            <GuideDesc>
              온탕·냉탕 순서부터 불한증막 활용법까지.<br />
              몸이 달라지는 사우나 루틴을 알려드립니다.
            </GuideDesc>
            <GuideLink>자세히 보기 →</GuideLink>
          </GuideLeft>
          <GuideRight>
            <GuideEmoji><RiSteamLine size={64} /></GuideEmoji>
          </GuideRight>
        </GuideCard>
      </SectionInner>
    </Section>
  );
}
