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
    background: radial-gradient(ellipse at 60% 40%, rgba(166,33,33,0.25) 0%, transparent 70%);
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
  font-size: clamp(32px, 6vw, 56px);
  font-weight: 900;
  color: white;
  line-height: 1.15;
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

export const HeroBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255,255,255,0.08);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
  margin: 0 6px 8px 0;
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

// ─── 키워드 3종 ───────────────────────────────────────────────────────────────

export const KeywordsSection = styled.section`
  background: ${({ theme }) => theme.colors.gray50};
  padding: 64px 20px;
`;

export const KeywordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const KeywordCard = styled.div<{ $accent: string }>`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-top: 5px solid ${({ $accent }) => $accent};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 24px;
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

export const KeywordFinnish = styled.p`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  font-style: italic;
  margin-bottom: 4px;
`;

export const KeywordKorean = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 14px;
`;

export const KeywordDesc = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray600};
`;

// ─── 단계별 가이드 ────────────────────────────────────────────────────────────

export const StepsSection = styled.section`
  padding: 72px 20px;
  background: white;
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px 28px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  &:last-child { border-bottom: none; }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const StepNum = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.dark};
  color: white;
  font-size: 16px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StepContent = styled.div`flex: 1;`;

export const StepTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 6px;
`;

export const StepDesc = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray600};
`;

export const StepTip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

// ─── 한국 vs 핀란드 비교 ──────────────────────────────────────────────────────

export const CompareSection = styled.section`
  background: ${({ theme }) => theme.colors.dark};
  padding: 72px 20px;
`;

export const CompareTitle = styled(SectionTitle)`
  color: white;
`;

export const CompareTable = styled.div`
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const CompareHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: rgba(255,255,255,0.08);
  border-bottom: 2px solid rgba(255,255,255,0.15);
`;

export const CompareHeaderCell = styled.div`
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255,255,255,0.5);
  &:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.1); }
`;

export const CompareRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  &:last-child { border-bottom: none; }
`;

export const CompareCell = styled.div<{ $highlight?: boolean }>`
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ $highlight }) => $highlight ? 'white' : 'rgba(255,255,255,0.55)'};
  font-weight: ${({ $highlight }) => $highlight ? 700 : 400};
  &:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.08); }
`;

export const HighlightDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.colors.primary};
`;

// ─── 에티켓 ───────────────────────────────────────────────────────────────────

export const EtiquetteSection = styled.section`
  padding: 72px 20px;
  background: ${({ theme }) => theme.colors.gray50};
`;

export const EtiquetteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const EtiquetteCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
`;

export const EtiquetteIconWrap = styled.div<{ $color: string }>`
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

export const EtiquetteTitle = styled.h3`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 8px;
`;

export const EtiquetteDesc = styled.p`
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
  border: 2px solid ${({ theme }) => theme.colors.dark};
  text-decoration: none;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; }
`;
