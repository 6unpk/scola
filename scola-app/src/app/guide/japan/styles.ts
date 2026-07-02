import Link from 'next/link';
import styled from 'styled-components';

// ─── 레이아웃 ─────────────────────────────────────────────────────────────────

export const PageWrap = styled.div`
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
`;

// ─── 히어로 ───────────────────────────────────────────────────────────────────

export const Hero = styled.section`
  background: ${({ theme }) => theme.colors.dark};
  padding: 80px 20px 64px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 40% 40%, rgba(220,38,38,0.2) 0%, transparent 65%),
                radial-gradient(ellipse at 80% 70%, rgba(251,191,36,0.08) 0%, transparent 60%);
    pointer-events: none;
  }
`;

export const HeroKicker = styled.p`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 18px;
`;

export const HeroTitle = styled.h1`
  font-family: var(--font-bagel-fat-one), sans-serif;
  font-size: clamp(36px, 6.5vw, 60px);
  font-weight: 400;
  color: white;
  line-height: 1.22;
  letter-spacing: -0.5px;
  margin-bottom: 20px;

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const HeroSub = styled.p`
  font-size: 17px;
  color: rgba(255,255,255,0.6);
  max-width: 560px;
  margin: 0 auto 36px;
  line-height: 1.7;
`;

export const HeroCountry = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.65);
  text-transform: uppercase;
  margin-bottom: 20px;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  text-decoration: none;
  margin-bottom: 36px;
  transition: color 0.15s;
  &:hover { color: white; }
`;

export const HeroBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255,255,255,0.08);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 13px;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  margin: 4px;
`;

// ─── 공통 섹션 ────────────────────────────────────────────────────────────────

export const SectionInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

export const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 40px;
  line-height: 1.3;
`;

// ─── 토토노우 섹션 ────────────────────────────────────────────────────────────

export const TotonoSection = styled.section`
  padding: 80px 20px;
  background: ${({ theme }) => theme.colors.gray50};
`;

export const TotonoCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const TotonoHeader = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  padding: 28px 32px;
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TotonoWordJp = styled.p`
  font-size: 42px;
  font-weight: 900;
  color: white;
  line-height: 1;
`;

export const TotonoWordKr = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.45);
  margin-top: 4px;
  font-weight: 600;
`;

export const TotonoHeaderRight = styled.div`flex: 1;`;

export const TotonoTagline = styled.p`
  font-size: 17px;
  font-weight: 800;
  color: white;
  line-height: 1.5;
  margin-bottom: 6px;
`;

export const TotonoSubTag = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.5);
`;

export const TotonoBody = styled.div`padding: 28px 32px;`;

export const TotonoFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 28px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

export const FlowStep = styled.div<{ $accent: string }>`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: ${({ $accent }) => $accent}18;
  border: 2px solid ${({ $accent }) => $accent}55;
  border-radius: ${({ theme }) => theme.radius.md};
  min-width: 110px;
`;

export const FlowArrow = styled.div`
  flex-shrink: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.gray300};
  padding: 0 6px;
`;

export const FlowIcon = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $color }) => $color}25;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FlowLabel = styled.p<{ $color: string }>`
  font-size: 13px;
  font-weight: 800;
  color: ${({ $color }) => $color};
`;

export const FlowSub = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray400};
  text-align: center;
`;

export const TotonoDesc = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.gray600};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  padding-left: 16px;
`;

// ─── 키워드 카드 ──────────────────────────────────────────────────────────────

export const KeywordsSection = styled.section`
  padding: 72px 20px;
  background: white;
`;

export const KeywordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const KeywordCard = styled.div<{ $accent: string }>`
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-top: 5px solid ${({ $accent }) => $accent};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 24px;
  background: white;
`;

export const KeywordIcon = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $color }) => $color}22;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  margin-bottom: 16px;
`;

export const KeywordJp = styled.p`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 4px;
`;

export const KeywordKr = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 14px;
`;

export const KeywordDesc = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray600};
`;

// ─── 인용구 ───────────────────────────────────────────────────────────────────

export const QuoteSection = styled.section`
  background: ${({ theme }) => theme.colors.dark};
  padding: 72px 20px;
`;

export const QuoteTitle = styled(SectionTitle)`
  color: white;
`;

export const QuoteBlock = styled.blockquote`
  border: 2px solid rgba(255,255,255,0.15);
  border-left: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 32px;
  margin: 0;
  background: rgba(255,255,255,0.04);
`;

export const QuoteText = styled.p`
  font-size: 17px;
  line-height: 1.85;
  color: rgba(255,255,255,0.8);
  font-style: italic;

  strong { color: white; font-style: normal; }
`;

// ─── 문화 ─────────────────────────────────────────────────────────────────────

export const CultureSection = styled.section`
  padding: 72px 20px;
  background: ${({ theme }) => theme.colors.gray50};
`;

export const CultureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const CultureCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
`;

export const CultureIconWrap = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`;

export const CultureTitle = styled.h3`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 8px;
`;

export const CultureDesc = styled.p`
  font-size: 13px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray500};
`;

// ─── CTA ──────────────────────────────────────────────────────────────────────

export const CtaSection = styled.section`
  padding: 80px 20px;
  text-align: center;
  background: white;
`;

export const CtaTitle = styled.h2`
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 14px;
  line-height: 1.3;
`;

export const CtaSub = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 32px;
`;

export const CtaBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 16px;
  font-weight: 800;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  text-decoration: none;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; }
`;
