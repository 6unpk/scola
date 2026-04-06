'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';

// ─── Styled Components ────────────────────────────────────────────────────────

const Banner = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  border-top: 2px solid ${({ theme }) => theme.colors.dark};
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark};
`;

const BannerInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

const BannerText = styled.div``;

const BannerTitle = styled.h3`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 4px;
`;

const BannerSub = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.6);
`;

const BannerBtn = styled.button`
  padding: 12px 28px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 15px;
  font-weight: 700;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PromoBannerSection() {
  const router = useRouter();

  return (
    <Banner>
      <BannerInner>
        <BannerText>
          <BannerTitle>♨️ 내 주변 사우나 지금 바로 찾아보세요</BannerTitle>
          <BannerSub>전국 사우나 & 찜질방 정보를 한눈에 — 위치, 시설, 가격까지</BannerSub>
        </BannerText>
        <BannerBtn onClick={() => router.push('/search')}>지금 탐색하기</BannerBtn>
      </BannerInner>
    </Banner>
  );
}
