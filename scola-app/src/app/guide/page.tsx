'use client';

import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import {
  RiArrowRightLine, RiFireLine, RiSnowflakeLine, RiLeafLine,
  RiCheckLine, RiDropLine, RiShieldLine, RiSparkling2Line,
} from '@remixicon/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// ─── Styled ───────────────────────────────────────────────────────────────────

const PageWrap = styled.div`
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
`;

const SectionInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
`;

// ── 히어로 ──
const Hero = styled.section`
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

const HeroEyebrow = styled.p`
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  border: 1.5px solid ${({ theme }) => theme.colors.primary}55;
  padding: 5px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  margin-bottom: 24px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(34px, 6vw, 60px);
  font-weight: 900;
  color: white;
  line-height: 1.12;
  margin-bottom: 8px;

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeroSubTitle = styled.p`
  font-size: clamp(15px, 2.5vw, 20px);
  font-weight: 600;
  color: rgba(255,255,255,0.45);
  margin-bottom: 24px;
  letter-spacing: -0.2px;
`;

const HeroDesc = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  max-width: 520px;
  margin: 0 auto 44px;
  line-height: 1.75;
`;

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
`;

const HeroStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
`;

const HeroStatNum = styled.span`
  font-size: 28px;
  font-weight: 900;
  color: white;
`;

const HeroStatLabel = styled.span`
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  font-weight: 600;
  letter-spacing: 0.5px;
`;

// ── 개요 ──
const IntroSection = styled.section`
  padding: 80px 20px;
  background: white;
`;

const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const IntroLeft = styled.div``;

const IntroTitle = styled.h2`
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.25;
  margin-bottom: 20px;

  em { font-style: normal; color: ${({ theme }) => theme.colors.primary}; }
`;

const IntroDesc = styled.p`
  font-size: 15px;
  line-height: 1.85;
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: 16px;
`;

const IntroRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const IntroBullet = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.gray50};
`;

const BulletIcon = styled.div<{ $color: string }>`
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

const BulletText = styled.div``;
const BulletTitle = styled.p`font-size: 14px; font-weight: 800; color: ${({ theme }) => theme.colors.dark}; margin-bottom: 3px;`;
const BulletDesc = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.gray500}; line-height: 1.55;`;

// ── 루틴 ──
const RoutineSection = styled.section`
  background: ${({ theme }) => theme.colors.gray50};
  padding: 80px 20px;
`;

const RoutineTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 12px;
  line-height: 1.3;
`;

const RoutineSub = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 40px;
  max-width: 520px;
`;

const RoutineFlow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  align-items: stretch;
  gap: 0;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: white;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const RoutineStep = styled.div<{ $accent: string }>`
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

const RoutineStepIcon = styled.div<{ $color: string }>`
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
const RoutineStepName = styled.p<{ $color: string }>`font-size: 16px; font-weight: 900; color: ${({ $color }) => $color}; margin-bottom: 4px;`;
const RoutineStepTime = styled.p`font-size: 12px; font-weight: 700; color: ${({ theme }) => theme.colors.gray400}; margin-bottom: 10px;`;
const RoutineStepDesc = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.gray500}; line-height: 1.6;`;

const RoutineResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 24px;
  background: ${({ theme }) => theme.colors.dark};
  text-align: center;
  gap: 8px;
`;

const RoutineResultLabel = styled.p`
  font-size: 13px;
  font-weight: 800;
  color: rgba(255,255,255,0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const RoutineResultWord = styled.p`
  font-size: 22px;
  font-weight: 900;
  color: white;
`;

const RoutineRepeat = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const RepeatBadge = styled.span`
  padding: 5px 14px;
  background: ${({ theme }) => theme.colors.dark};
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 13px;
  font-weight: 800;
`;

// ── 두 가지 스타일 ──
const StyleSection = styled.section`
  padding: 80px 20px;
  background: white;
`;

const StyleTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 40px;
  line-height: 1.3;
`;

const StyleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const StyleCard = styled(Link)<{ $dark?: boolean }>`
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
  background: ${({ $dark, theme }) => $dark ? theme.colors.dark : 'white'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`;

const StyleCardTop = styled.div<{ $bg: string }>`
  background: ${({ $bg }) => $bg};
  padding: 32px 28px 24px;
`;

const StyleCardCountry = styled.div`
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
const StyleCardLabel = styled.p`font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 6px;`;
const StyleCardTitle = styled.h3`font-size: 22px; font-weight: 900; color: white; margin-bottom: 8px; line-height: 1.2;`;
const StyleCardKeyword = styled.p`font-size: 14px; color: rgba(255,255,255,0.6); font-style: italic;`;

const StyleCardBody = styled.div`
  padding: 20px 28px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyleCardDesc = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray600};
  flex: 1;
  margin-bottom: 20px;
`;

const StyleCardLink = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

// ── 한국형 꿀조합 ──
const TipsSection = styled.section`
  background: ${({ theme }) => theme.colors.dark};
  padding: 80px 20px;
`;

const TipsTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: white;
  margin-bottom: 40px;
  line-height: 1.3;
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const TipCard = styled.div`
  border: 1.5px solid rgba(255,255,255,0.12);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  background: rgba(255,255,255,0.04);
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.07); }
`;

const TipIconWrap = styled.div<{ $color: string }>`
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
const TipTitle = styled.h3`font-size: 15px; font-weight: 800; color: white; margin-bottom: 8px;`;
const TipDesc = styled.p`font-size: 13px; line-height: 1.75; color: rgba(255,255,255,0.55);`;
const TipPoint = styled.p`
  margin-top: 12px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  padding: 6px 12px;
  background: rgba(166,33,33,0.15);
  border-radius: ${({ theme }) => theme.radius.full};
  display: inline-block;
`;

// ── 에티켓 ──
const EtiquetteSection = styled.section`
  padding: 80px 20px;
  background: ${({ theme }) => theme.colors.gray50};
`;

const EtiquetteTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 40px;
`;

const EtiquetteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: white;
  overflow: hidden;
`;

const EtiquetteItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  &:last-child { border-bottom: none; }
`;

const EtiquetteNum = styled.div`
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

const EtiquetteContent = styled.div``;
const EtiquetteItemTitle = styled.p`font-size: 15px; font-weight: 800; color: ${({ theme }) => theme.colors.dark}; margin-bottom: 4px;`;
const EtiquetteItemDesc = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.gray500}; line-height: 1.65;`;

// ── 인용 CTA ──
const QuoteSection = styled.section`
  padding: 80px 20px;
  background: white;
  text-align: center;
`;

const QuoteText = styled.blockquote`
  font-size: clamp(18px, 3vw, 26px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  line-height: 1.55;
  max-width: 680px;
  margin: 0 auto 12px;
  quotes: none;

  em { font-style: normal; color: ${({ theme }) => theme.colors.primary}; }
`;

const QuoteSub = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 40px;
`;

const CtaBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 36px;
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROUTINE_STEPS = [
  { name: '사우나', time: '8~12분', color: '#C62828', accent: '#C62828', desc: '체온을 서서히 올립니다. 무리하지 말고 편안하게.', icon: <RiFireLine size={22} /> },
  { name: '냉탕', time: '1~2분', color: '#1565C0', accent: '#1565C0', desc: '심부 온도를 급격히 낮춥니다. 자율신경이 자극됩니다.', icon: <RiSnowflakeLine size={22} /> },
  { name: '외기욕', time: '5~10분', color: '#2E7D32', accent: '#2E7D32', desc: '의자에 앉아 눈 감고 바람을 느낍니다. 이 단계가 핵심입니다.', icon: <RiLeafLine size={22} /> },
];

const TIPS = [
  {
    icon: <RiShieldLine size={20} />,
    color: '#7B1FA2',
    title: '사우나 모자 챙기기',
    desc: '양머리 대신 전용 사우나 모자를 챙기세요. 머리와 두피를 열기로부터 보호해 더 오래, 더 깊게 즐길 수 있습니다.',
    point: '핀란드·일본 사우나의 필수 아이템',
  },
  {
    icon: <RiDropLine size={20} />,
    color: '#0277BD',
    title: '오로포로 전해질 충전',
    desc: '일본 사우나 마니아들의 국민 음료. 오로나민C와 포카리스웨트를 1:1로 섞으면 비타민과 전해질을 동시에 보충할 수 있습니다.',
    point: '사우나 후 최고의 회복 음료',
  },
  {
    icon: <RiLeafLine size={20} />,
    color: '#2E7D32',
    title: '야외 테라스 or 선풍기 활용',
    desc: '핀란드 호수나 일본 외기욕장이 없어도 괜찮습니다. 사우나 테라스나 선풍기 앞, 젖은 몸에 닿는 바람 한 점이 당신을 핀란드 숲속으로 데려다줍니다.',
    point: '외기욕의 한국식 버전',
  },
];

const ETIQUETTE = [
  { title: '온도 경쟁은 하지 않는다', desc: '누가 더 오래 버티나 시합하는 건 진짜 사우나 방식이 아닙니다. 내 몸이 "이제 나가고 싶다"고 느낄 때가 나가야 할 순간입니다.' },
  { title: '개인 깔개는 필수', desc: '나무 벤치에 맨몸이 직접 닿지 않도록 개인 수건이나 깔개를 사용하세요. 위생은 물론 뜨거움으로부터 피부를 보호해 줍니다.' },
  { title: '수분은 꾸준히', desc: '사우나 전, 사이, 후 모두 충분한 물을 마시세요. 탈수는 사우나의 가장 흔한 위험입니다. 알코올은 사우나 직전에 피하세요.' },
  { title: '정숙하게', desc: '사우나는 명상과 회복의 공간입니다. 큰 소리로 대화하기보다 조용히 열기와 함께 자신에게 집중해 보세요.' },
  { title: '뢸뤼는 동의를 구하고', desc: '사우나 스톤에 물을 뿌리기 전, 함께 있는 사람들에게 먼저 물어보세요. 습도와 온도가 갑자기 올라가기 때문에 배려가 필요합니다.' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuidePage() {
  return (
    <PageWrap>
      <Navbar />

      {/* ── 히어로 ── */}
      <Hero>
        <SectionInner style={{ position: 'relative', zIndex: 1 }}>
          <HeroEyebrow>Sauna Guide</HeroEyebrow>
          <HeroTitle>땀만 빼는 사우나는 끝났다</HeroTitle>
          <HeroSubTitle>이제는 '사우나 2.0' 시대</HeroSubTitle>
          <HeroDesc>
            핀란드식 힐링과 일본식 쾌감, 그 사이에서 당신만의 루틴을 찾아보세요.
            사우나는 단순한 목욕이 아닌, <strong style={{ color: 'white' }}>나를 다시 세우는 가장 완벽한 1시간</strong>입니다.
          </HeroDesc>
          <HeroStats>
            <HeroStat>
              <HeroStatNum>3×</HeroStatNum>
              <HeroStatLabel>온냉 반복 세트</HeroStatLabel>
            </HeroStat>
            <HeroStat>
              <HeroStatNum>60°+</HeroStatNum>
              <HeroStatLabel>사우나 적정 온도</HeroStatLabel>
            </HeroStat>
            <HeroStat>
              <HeroStatNum>1hr</HeroStatNum>
              <HeroStatLabel>권장 이용 시간</HeroStatLabel>
            </HeroStat>
          </HeroStats>
        </SectionInner>
      </Hero>

      {/* ── 개요 ── */}
      <IntroSection>
        <SectionInner>
          <IntroGrid>
            <IntroLeft>
              <SectionLabel>Why Sauna</SectionLabel>
              <IntroTitle>
                우리가 알던 사우나와는<br />
                <em>완전히 다른 경험</em>
              </IntroTitle>
              <IntroDesc>
                한국의 사우나 문화는 세계 최고 수준이지만, '피로를 푸는 곳'이라는 고정관념에 갇혀 있기도 합니다.
                핀란드에서는 영혼을 정돈하는 의식, 일본에서는 뇌를 리셋하는 루틴—이 두 가지 방식을 알고 나면
                사우나를 보는 눈이 완전히 달라집니다.
              </IntroDesc>
              <IntroDesc>
                이 가이드는 그 진입점입니다.
              </IntroDesc>
            </IntroLeft>
            <IntroRight>
              <IntroBullet>
                <BulletIcon $color="#C62828"><RiFireLine size={18} /></BulletIcon>
                <BulletText>
                  <BulletTitle>뢸뤼(Löyly)의 원리</BulletTitle>
                  <BulletDesc>달궈진 돌 위에 물을 뿌려 만드는 증기. 건조한 열기가 아닌 촉촉하고 부드러운 열이 몸을 감쌉니다.</BulletDesc>
                </BulletText>
              </IntroBullet>
              <IntroBullet>
                <BulletIcon $color="#1565C0"><RiSnowflakeLine size={18} /></BulletIcon>
                <BulletText>
                  <BulletTitle>온냉 반복의 과학</BulletTitle>
                  <BulletDesc>열기와 냉기를 오가면 자율신경이 균형을 찾고, 뇌가 맑아지며 몸이 붕 뜨는 '토토노우' 상태에 도달합니다.</BulletDesc>
                </BulletText>
              </IntroBullet>
              <IntroBullet>
                <BulletIcon $color="#388E3C"><RiLeafLine size={18} /></BulletIcon>
                <BulletText>
                  <BulletTitle>외기욕(外気浴)의 힘</BulletTitle>
                  <BulletDesc>사우나와 냉탕 이후, 바깥 공기 속 휴식이 핵심입니다. 이 세 번째 단계를 빠뜨리지 마세요.</BulletDesc>
                </BulletText>
              </IntroBullet>
            </IntroRight>
          </IntroGrid>
        </SectionInner>
      </IntroSection>

      {/* ── 온냉 반복 루틴 ── */}
      <RoutineSection>
        <SectionInner>
          <SectionLabel>The Routine</SectionLabel>
          <RoutineTitle>황금 루틴: 사우나 → 냉탕 → 외기욕</RoutineTitle>
          <RoutineSub>이 세 단계의 반복이 몸과 마음을 정돈시키는 핵심입니다. 복잡한 기술 없이, 순서 하나만 지켜보세요.</RoutineSub>
          <RoutineFlow>
            {ROUTINE_STEPS.map((step) => (
              <RoutineStep key={step.name} $accent={step.accent}>
                <RoutineStepIcon $color={step.color}>{step.icon}</RoutineStepIcon>
                <RoutineStepName $color={step.color}>{step.name}</RoutineStepName>
                <RoutineStepTime>{step.time}</RoutineStepTime>
                <RoutineStepDesc>{step.desc}</RoutineStepDesc>
              </RoutineStep>
            ))}
            <RoutineResult>
              <RiSparkling2Line size={22} color="rgba(255,255,255,0.4)" />
              <RoutineResultLabel>결과</RoutineResultLabel>
              <RoutineResultWord>토토노우</RoutineResultWord>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: 4 }}>정돈된 몸과 마음</p>
            </RoutineResult>
          </RoutineFlow>
          <RoutineRepeat>
            <RepeatBadge>×3 반복</RepeatBadge>
            <span>이 세트를 3번 반복할 때 효과가 가장 좋습니다. 총 소요 시간 약 1시간.</span>
          </RoutineRepeat>
        </SectionInner>
      </RoutineSection>

      {/* ── 두 가지 스타일 ── */}
      <StyleSection>
        <SectionInner>
          <SectionLabel>Deep Dive</SectionLabel>
          <StyleTitle>두 가지 사우나 철학, 더 깊이 알아보기</StyleTitle>
          <StyleGrid>
            <StyleCard href="/guide/finland">
              <StyleCardTop $bg="linear-gradient(135deg, #1a1a2e 0%, #6b1a1a 100%)">
                <StyleCardCountry>Finland</StyleCardCountry>
                <StyleCardLabel>핀란드식 사우나</StyleCardLabel>
                <StyleCardTitle>핀란드식<br />사우나 즐기기</StyleCardTitle>
                <StyleCardKeyword>뢸뤼 · 비흐타 · 아반토</StyleCardKeyword>
              </StyleCardTop>
              <StyleCardBody>
                <StyleCardDesc>
                  핀란드인들에게 사우나는 성당과도 같은 신성한 공간입니다.
                  '온도'가 아닌 '습도'에서 핵심을 찾는 정통 방식—
                  뢸뤼, 비흐타, 아반토 세 가지 키워드로 완전히 이해해 보세요.
                </StyleCardDesc>
                <StyleCardLink>
                  자세히 보기 <RiArrowRightLine size={14} />
                </StyleCardLink>
              </StyleCardBody>
            </StyleCard>

            <StyleCard href="/guide/japan">
              <StyleCardTop $bg="linear-gradient(135deg, #1a1a1a 0%, #1a2a4a 100%)">
                <StyleCardCountry>Japan</StyleCardCountry>
                <StyleCardLabel>일본식 사우나</StyleCardLabel>
                <StyleCardTitle>일본식<br />사우나 즐기기</StyleCardTitle>
                <StyleCardKeyword>토토노우 · 사우너 · 사메시</StyleCardKeyword>
              </StyleCardTop>
              <StyleCardBody>
                <StyleCardDesc>
                  일본 Z세대가 퇴근 후 술집 대신 사우나로 향하는 이유.
                  핀란드 전통을 독창적인 문화로 발전시킨 일본의 사우나 붐—
                  토토노우의 마법과 사우나 라이프스타일을 만나보세요.
                </StyleCardDesc>
                <StyleCardLink>
                  자세히 보기 <RiArrowRightLine size={14} />
                </StyleCardLink>
              </StyleCardBody>
            </StyleCard>
          </StyleGrid>
        </SectionInner>
      </StyleSection>

      {/* ── 한국형 꿀조합 ── */}
      <TipsSection>
        <SectionInner>
          <SectionLabel style={{ color: 'rgba(255,255,255,0.4)' }}>Korean Tips</SectionLabel>
          <TipsTitle>한국형 사우너를 위한 꿀조합</TipsTitle>
          <TipsGrid>
            {TIPS.map((tip) => (
              <TipCard key={tip.title}>
                <TipIconWrap $color={tip.color}>{tip.icon}</TipIconWrap>
                <TipTitle>{tip.title}</TipTitle>
                <TipDesc>{tip.desc}</TipDesc>
                <TipPoint>{tip.point}</TipPoint>
              </TipCard>
            ))}
          </TipsGrid>
        </SectionInner>
      </TipsSection>

      {/* ── 에티켓 ── */}
      <EtiquetteSection>
        <SectionInner>
          <SectionLabel>Etiquette</SectionLabel>
          <EtiquetteTitle>알아두면 좋은 사우나 에티켓</EtiquetteTitle>
          <EtiquetteList>
            {ETIQUETTE.map((e, i) => (
              <EtiquetteItem key={e.title}>
                <EtiquetteNum>{i + 1}</EtiquetteNum>
                <EtiquetteContent>
                  <EtiquetteItemTitle>
                    <RiCheckLine size={13} style={{ marginRight: 5, verticalAlign: 'middle', color: '#A62121' }} />
                    {e.title}
                  </EtiquetteItemTitle>
                  <EtiquetteItemDesc>{e.desc}</EtiquetteItemDesc>
                </EtiquetteContent>
              </EtiquetteItem>
            ))}
          </EtiquetteList>
        </SectionInner>
      </EtiquetteSection>

      {/* ── 인용 CTA ── */}
      <QuoteSection>
        <SectionInner>
          <QuoteText>
            "사우나는 단순한 목욕이 아닙니다.<br />
            <em>나를 다시 세우는 가장 완벽한 1시간</em>입니다."
          </QuoteText>
          <QuoteSub>지금 바로 가까운 사우나에서 당신만의 정돈되는 시간을 찾아보세요.</QuoteSub>
          <CtaBtn href="/search?category=sauna">
            내 주변 사우나 찾기 <RiArrowRightLine size={18} />
          </CtaBtn>
        </SectionInner>
      </QuoteSection>

      <Footer />
    </PageWrap>
  );
}
