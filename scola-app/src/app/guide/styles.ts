import Link from 'next/link';
import styled from 'styled-components';
import { cardBase, cardHover } from '@/components/ui/Card';

// ─── 레이아웃 ─────────────────────────────────────────────────────────────────

export const PageWrap = styled.div`
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
`;

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

// ─── 히어로 ───────────────────────────────────────────────────────────────────

export const Hero = styled.section`
  background: ${({ theme }) => theme.colors.dark} url('/guide/hero.webp') center / cover no-repeat;
  padding: 130px 20px 100px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.7) 60%, rgba(13,13,13,0.92) 100%),
      radial-gradient(ellipse at 30% 50%, rgba(166,33,33,0.25) 0%, transparent 60%);
    pointer-events: none;
  }
`;

export const HeroEyebrow = styled.p`
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
`;

export const HeroTitle = styled.h1`
  font-family: var(--font-bagel-fat-one), sans-serif;
  font-size: clamp(38px, 6.5vw, 66px);
  font-weight: 400;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin-bottom: 14px;

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const HeroSubTitle = styled.p`
  font-size: clamp(15px, 2.5vw, 20px);
  font-weight: 600;
  color: rgba(255,255,255,0.45);
  margin-bottom: 24px;
  letter-spacing: -0.2px;
`;

export const HeroDesc = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  max-width: 520px;
  margin: 0 auto 44px;
  line-height: 1.75;
`;

export const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
`;

export const HeroStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
`;

export const HeroStatNum = styled.span`
  font-size: 28px;
  font-weight: 900;
  color: white;
`;

export const HeroStatLabel = styled.span`
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  font-weight: 600;
  letter-spacing: 0.5px;
`;

// ─── 개요 ─────────────────────────────────────────────────────────────────────

export const IntroSection = styled.section`
  padding: 80px 20px;
  background: white;
`;

export const IntroGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const IntroLeft = styled.div`
  max-width: 720px;
`;

export const IntroTitle = styled.h2`
  font-size: clamp(30px, 5vw, 46px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin-bottom: 24px;

  em { font-style: normal; color: ${({ theme }) => theme.colors.primary}; }
`;

export const IntroDesc = styled.p`
  font-size: 17px;
  line-height: 1.85;
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: 18px;
`;

export const IntroRight = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const IntroBullet = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.gray50};
`;

export const BulletIcon = styled.div<{ $color: string }>`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BulletText = styled.div``;
export const BulletTitle = styled.p`font-size: 14px; font-weight: 800; color: ${({ theme }) => theme.colors.dark}; margin-bottom: 3px;`;
export const BulletDesc = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.gray500}; line-height: 1.55;`;

// ─── 루틴 ─────────────────────────────────────────────────────────────────────

export const RoutineSection = styled.section`
  background: ${({ theme }) => theme.colors.gray50};
  padding: 80px 20px;
`;

export const RoutineTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 12px;
  line-height: 1.3;
`;

export const RoutineSub = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 40px;
  max-width: 520px;
`;

export const RoutineFlow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

export const RoutineStep = styled.div`
  ${cardBase}
`;

export const RoutineStepImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
`;

export const RoutineStepBody = styled.div`
  padding: 18px 20px 22px;
`;

export const RoutineStepMeta = styled.p`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 6px;
`;

export const RoutineStepName = styled.p`
  font-size: 19px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 6px;
`;

export const RoutineStepDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  line-height: 1.65;
`;

export const RoutineResult = styled.div`
  margin-top: 16px;
  padding: 24px 28px;
  background: ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};

  @media (max-width: 650px) {
    padding: 20px;
  }
`;

export const RoutineRepeat = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;

  @media (max-width: 650px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const RepeatBadge = styled.span`
  flex-shrink: 0;
  padding: 6px 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 13px;
  font-weight: 800;
  line-height: 1.3;
`;

export const RoutineRepeatText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  strong { font-size: 15px; font-weight: 800; color: white; }
  span { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.5; }
`;

// ─── 두 가지 스타일 ───────────────────────────────────────────────────────────

export const StyleSection = styled.section`
  padding: 80px 20px;
  background: white;
`;

export const StyleTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 40px;
  line-height: 1.3;
`;

export const StyleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const StyleCard = styled(Link)`
  display: flex;
  flex-direction: column;
  ${cardBase}
  ${cardHover}
  text-decoration: none;
`;

export const StyleCardImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
`;

export const StyleCardBody = styled.div`
  padding: 18px 20px 22px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const StyleCardMeta = styled.p`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 6px;
`;

export const StyleCardTitle = styled.h3`
  font-size: 19px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 8px;
`;

export const StyleCardDesc = styled.p`
  font-size: 13px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.gray500};
  flex: 1;
  margin-bottom: 16px;
`;

export const StyleCardLink = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

// ─── 한국형 꿀조합 ────────────────────────────────────────────────────────────

export const TipsSection = styled.section`
  background: ${({ theme }) => theme.colors.dark};
  padding: 80px 20px;
`;

export const TipsTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: white;
  margin-bottom: 40px;
  line-height: 1.3;
`;

export const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const TipCard = styled.div`
  border: 1.5px solid rgba(255,255,255,0.12);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  background: rgba(255,255,255,0.04);
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.07); }
`;

export const TipTitle = styled.h3`font-size: 15px; font-weight: 800; color: white; margin-bottom: 8px;`;
export const TipDesc = styled.p`font-size: 13px; line-height: 1.75; color: rgba(255,255,255,0.55);`;
export const TipPoint = styled.p`
  margin-top: 12px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  padding: 6px 12px;
  background: rgba(166,33,33,0.15);
  border-radius: ${({ theme }) => theme.radius.full};
  display: inline-block;
`;

// ─── 에티켓 ───────────────────────────────────────────────────────────────────

export const EtiquetteSection = styled.section`
  padding: 80px 20px;
  background: ${({ theme }) => theme.colors.gray50};
`;

export const EtiquetteTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 40px;
`;

export const EtiquetteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
`;

export const EtiquetteItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  &:last-child { border-bottom: none; }
`;

export const EtiquetteNum = styled.div`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.dark};
  color: white;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EtiquetteContent = styled.div``;
export const EtiquetteItemTitle = styled.p`font-size: 15px; font-weight: 800; color: ${({ theme }) => theme.colors.dark}; margin-bottom: 4px;`;
export const EtiquetteItemDesc = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.gray500}; line-height: 1.65;`;

// ─── 인용 CTA ─────────────────────────────────────────────────────────────────

export const QuoteSection = styled.section`
  padding: 80px 20px;
  background: white;
  text-align: center;
`;

export const QuoteText = styled.blockquote`
  font-size: clamp(18px, 3vw, 26px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.55;
  max-width: 680px;
  margin: 0 auto 12px;
  quotes: none;

  em { font-style: normal; color: ${({ theme }) => theme.colors.primary}; }
`;

export const QuoteSub = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 40px;
`;

export const CtaBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 36px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 16px;
  font-weight: 800;
  border-radius: ${({ theme }) => theme.radius.full};
  text-decoration: none;
  box-shadow: 0 6px 18px rgba(166,33,33,0.28);
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(166,33,33,0.34); }
`;
