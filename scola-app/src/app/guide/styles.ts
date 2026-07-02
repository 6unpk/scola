import Link from 'next/link';
import styled from 'styled-components';

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
  background: ${({ theme }) => theme.colors.dark};
  padding: 100px 20px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 50%, rgba(166,33,33,0.3) 0%, transparent 60%),
      radial-gradient(ellipse at 75% 30%, rgba(166,33,33,0.12) 0%, transparent 55%);
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const IntroLeft = styled.div``;

export const IntroTitle = styled.h2`
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.25;
  margin-bottom: 20px;

  em { font-style: normal; color: ${({ theme }) => theme.colors.primary}; }
`;

export const IntroDesc = styled.p`
  font-size: 15px;
  line-height: 1.85;
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: 16px;
`;

export const IntroRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  grid-template-columns: repeat(3, 1fr) auto;
  align-items: stretch;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

export const RoutineStep = styled.div<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px;
  border-right: 1px solid ${({ theme }) => theme.colors.gray100};
  text-align: center;
  position: relative;

  &::before {
    content: '';
    display: block;
    height: 4px;
    width: 100%;
    background: ${({ $accent }) => $accent};
    position: absolute;
    top: 0;
    left: 0;
  }

  @media (max-width: 650px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  }
`;

export const RoutineStepIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
`;
export const RoutineStepName = styled.p<{ $color: string }>`font-size: 16px; font-weight: 900; color: ${({ $color }) => $color}; margin-bottom: 4px;`;
export const RoutineStepTime = styled.p`font-size: 12px; font-weight: 700; color: ${({ theme }) => theme.colors.gray400}; margin-bottom: 10px;`;
export const RoutineStepDesc = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.gray500}; line-height: 1.6;`;

export const RoutineResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 24px;
  background: ${({ theme }) => theme.colors.dark};
  text-align: center;
  gap: 8px;
`;

export const RoutineResultLabel = styled.p`
  font-size: 13px;
  font-weight: 800;
  color: rgba(255,255,255,0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const RoutineResultWord = styled.p`
  font-size: 22px;
  font-weight: 900;
  color: white;
`;

export const RoutineRepeat = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
`;

export const RepeatBadge = styled.span`
  padding: 5px 14px;
  background: ${({ theme }) => theme.colors.dark};
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 13px;
  font-weight: 800;
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

export const StyleCard = styled(Link)<{ $dark?: boolean }>`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.18s, box-shadow 0.18s;
  background: ${({ $dark, theme }) => $dark ? theme.colors.dark : 'white'};
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(0,0,0,0.12);
  }
`;

export const StyleCardTop = styled.div<{ $bg: string }>`
  background: ${({ $bg }) => $bg};
  padding: 32px 28px 24px;
`;

export const StyleCardCountry = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  margin-bottom: 14px;
`;
export const StyleCardLabel = styled.p`font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 6px;`;
export const StyleCardTitle = styled.h3`font-size: 22px; font-weight: 900; color: white; margin-bottom: 8px; line-height: 1.2;`;
export const StyleCardKeyword = styled.p`font-size: 14px; color: rgba(255,255,255,0.6); font-style: italic;`;

export const StyleCardBody = styled.div`
  padding: 20px 28px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const StyleCardDesc = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray600};
  flex: 1;
  margin-bottom: 20px;
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

export const TipIconWrap = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $color }) => $color}25;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
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
