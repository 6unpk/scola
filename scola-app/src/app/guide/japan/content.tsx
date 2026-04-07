'use client';

import Link from 'next/link';
import styled from 'styled-components';
import {
  RiArrowLeftLine, RiMindMap, RiBookOpenLine, RiSmartphoneLine,
  RiGroupLine, RiCheckLine, RiArrowRightLine, RiStarSmileLine,
  RiFireLine, RiSnowflakeLine, RiLeafLine, RiSparkling2Line,
  RiShieldLine, RiRestaurantLine,
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

// ── 히어로 ──
const Hero = styled.section`
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

const HeroKicker = styled.p`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 18px;
`;

const HeroTitle = styled.h1`
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

const HeroSub = styled.p`
  font-size: 17px;
  color: rgba(255,255,255,0.6);
  max-width: 560px;
  margin: 0 auto 36px;
  line-height: 1.7;
`;

const HeroCountry = styled.div`
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

const BackLink = styled(Link)`
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

const HeroBadge = styled.span`
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

// ── 공통 섹션 ──
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

const SectionTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 40px;
  line-height: 1.3;
`;

// ── 토토노우 메인 섹션 ──
const TotonoSection = styled.section`
  padding: 80px 20px;
  background: ${({ theme }) => theme.colors.gray50};
`;

const TotonoCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const TotonoHeader = styled.div`
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

const TotonoWordJp = styled.p`
  font-size: 42px;
  font-weight: 900;
  color: white;
  line-height: 1;
`;

const TotonoWordKr = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.45);
  margin-top: 4px;
  font-weight: 600;
`;

const TotonoHeaderRight = styled.div`flex: 1;`;

const TotonoTagline = styled.p`
  font-size: 17px;
  font-weight: 800;
  color: white;
  line-height: 1.5;
  margin-bottom: 6px;
`;

const TotonoSubTag = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.5);
`;

const TotonoBody = styled.div`padding: 28px 32px;`;

const TotonoFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 28px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const FlowStep = styled.div<{ $accent: string }>`
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

const FlowArrow = styled.div`
  flex-shrink: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.gray300};
  padding: 0 6px;
`;

const FlowIcon = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $color }) => $color}25;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FlowLabel = styled.p<{ $color: string }>`
  font-size: 13px;
  font-weight: 800;
  color: ${({ $color }) => $color};
`;

const FlowSub = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray400};
  text-align: center;
`;

const TotonoDesc = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.gray600};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  padding-left: 16px;
`;

// ── 키워드 카드들 ──
const KeywordsSection = styled.section`
  padding: 72px 20px;
  background: white;
`;

const KeywordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const KeywordCard = styled.div<{ $accent: string }>`
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-top: 5px solid ${({ $accent }) => $accent};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 24px;
  background: white;
`;

const KeywordIcon = styled.div<{ $color: string }>`
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

const KeywordJp = styled.p`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 4px;
`;

const KeywordKr = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 14px;
`;

const KeywordDesc = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray600};
`;

// ── 인용구 ──
const QuoteSection = styled.section`
  background: ${({ theme }) => theme.colors.dark};
  padding: 72px 20px;
`;

const QuoteTitle = styled(SectionTitle)`
  color: white;
`;

const QuoteBlock = styled.blockquote`
  border: 2px solid rgba(255,255,255,0.15);
  border-left: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 32px;
  margin: 0;
  background: rgba(255,255,255,0.04);
`;

const QuoteText = styled.p`
  font-size: 17px;
  line-height: 1.85;
  color: rgba(255,255,255,0.8);
  font-style: italic;

  strong { color: white; font-style: normal; }
`;

// ── 굿즈·문화 ──
const CultureSection = styled.section`
  padding: 72px 20px;
  background: ${({ theme }) => theme.colors.gray50};
`;

const CultureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const CultureCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
`;

const CultureIconWrap = styled.div<{ $color: string }>`
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

const CultureTitle = styled.h3`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 8px;
`;

const CultureDesc = styled.p`
  font-size: 13px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray500};
`;

// ── CTA ──
const CtaSection = styled.section`
  padding: 80px 20px;
  text-align: center;
  background: white;
`;

const CtaTitle = styled.h2`
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 14px;
  line-height: 1.3;
`;

const CtaSub = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 32px;
`;

const CtaBtn = styled(Link)`
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const KEYWORDS = [
  {
    jp: 'サ道 (사도)',
    kr: '사우나의 길',
    accent: '#C62828',
    iconColor: '#C62828',
    icon: <RiBookOpenLine size={22} />,
    desc: '타나카 카츠키의 만화 <사도>가 드라마로 제작되어 대박을 쳤습니다. "사우나는 아저씨들이나 가는 곳"이라는 편견을 깨고, 젊은 층이 사우나를 힙한 취미로 인식하게 만든 결정적 계기가 되었습니다.',
  },
  {
    jp: 'Saunner (사우너)',
    kr: '사우나 마니아',
    accent: '#1565C0',
    iconColor: '#1565C0',
    icon: <RiStarSmileLine size={22} />,
    desc: '사우나를 미치도록 좋아하는 사람들을 스스로 \'사우너\'라고 부르며 SNS에 자신의 사우나 기록을 공유합니다. 사우나가 하나의 정체성이자 라이프스타일이 된 것입니다.',
  },
  {
    jp: 'Aufguss (아우프구스)',
    kr: '수건 퍼포먼스',
    accent: '#F57C00',
    iconColor: '#F57C00',
    icon: <RiMindMap size={22} />,
    desc: '사우나 스톤에 물을 뿌려 발생한 증기를 수건으로 휘둘러 손님에게 보내주는 아우프구스를 화려한 퍼포먼스나 대회로 발전시켰습니다. 일본만의 독창적인 사우나 엔터테인먼트입니다.',
  },
  {
    jp: 'ソーシャルサウナ',
    kr: '소셜 사우나',
    accent: '#388E3C',
    iconColor: '#388E3C',
    icon: <RiGroupLine size={22} />,
    desc: '술집 대신 사우나에서 친구를 만나 건강하게 교류하는 소셜 사우나 트렌드. Z세대를 중심으로 사우나가 새로운 사교 공간으로 자리 잡고 있습니다.',
  },
];

const CULTURE_ITEMS = [
  {
    icon: <RiShieldLine size={20} />,
    color: '#7B1FA2',
    title: '사우나 모자',
    desc: '열기로부터 머리카락과 두피를 보호하는 사우나 전용 모자. 지금은 개성을 드러내는 패션 아이템이 되었습니다.',
  },
  {
    icon: <RiRestaurantLine size={20} />,
    color: '#E65100',
    title: '사메시 (サ飯)',
    desc: '\'사우나 + 메시(밥)\'의 합성어. 사우나 후 먹는 음식 문화로, 이온음료와 비타민 음료를 섞은 \'오로포\'가 대표 음료입니다.',
  },
  {
    icon: <RiSmartphoneLine size={20} />,
    color: '#1565C0',
    title: '디지털 디톡스',
    desc: '스마트폰을 손에서 놓지 못하는 현대인에게 사우나는 오롯이 자기 자신에게 집중할 수 있는 유일한 공간입니다.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JapanGuidePage() {
  return (
    <PageWrap>
      <Navbar />

      {/* ── 히어로 ── */}
      <Hero>
        <SectionInner style={{ position: 'relative', zIndex: 1 }}>
          <HeroKicker>Japan Sauna Culture</HeroKicker>
          <HeroTitle>
            퇴근 후 술집 대신 사우나—<br />
            <em>일본 사우나 붐</em>의 모든 것
          </HeroTitle>
          <HeroSub>
            일본 Z세대가 사우나에 열광하는 이유, 바로 <strong style={{ color: 'white' }}>'토토노우(整う)'</strong>의 마법 때문입니다.
            핀란드에서 시작된 이 건강한 휴식이 일본을 거쳐 새로운 라이프스타일로 진화했습니다.
          </HeroSub>
          <div>
            <HeroBadge>#토토노우</HeroBadge>
            <HeroBadge>#사우너</HeroBadge>
            <HeroBadge>#사메시</HeroBadge>
            <HeroBadge>#소셜사우나</HeroBadge>
          </div>
        </SectionInner>
      </Hero>

      {/* ── 토토노우 메인 ── */}
      <TotonoSection>
        <SectionInner>
          <SectionLabel>Core Concept</SectionLabel>
          <SectionTitle>토토노우 (整う) — 일본 사우나 붐의 심장</SectionTitle>
          <TotonoCard>
            <TotonoHeader>
              <div>
                <TotonoWordJp>整う</TotonoWordJp>
                <TotonoWordKr>토토노우</TotonoWordKr>
              </div>
              <TotonoHeaderRight>
                <TotonoTagline>정신이 정돈되고, 몸이 붕 뜨는 황홀한 쾌감</TotonoTagline>
                <TotonoSubTag>2021 일본 신어·유행어 대상 후보 선정</TotonoSubTag>
              </TotonoHeaderRight>
            </TotonoHeader>
            <TotonoBody>
              <TotonoFlow>
                <FlowStep $accent="#C62828">
                  <FlowIcon $color="#C62828"><RiFireLine size={18} /></FlowIcon>
                  <FlowLabel $color="#C62828">사우나</FlowLabel>
                  <FlowSub>8~12분</FlowSub>
                </FlowStep>
                <FlowArrow>→</FlowArrow>
                <FlowStep $accent="#1565C0">
                  <FlowIcon $color="#1565C0"><RiSnowflakeLine size={18} /></FlowIcon>
                  <FlowLabel $color="#1565C0">냉탕</FlowLabel>
                  <FlowSub>1~2분</FlowSub>
                </FlowStep>
                <FlowArrow>→</FlowArrow>
                <FlowStep $accent="#388E3C">
                  <FlowIcon $color="#388E3C"><RiLeafLine size={18} /></FlowIcon>
                  <FlowLabel $color="#388E3C">외기욕</FlowLabel>
                  <FlowSub>5~10분</FlowSub>
                </FlowStep>
                <FlowArrow>→</FlowArrow>
                <FlowStep $accent="#7B1FA2">
                  <FlowIcon $color="#7B1FA2"><RiSparkling2Line size={18} /></FlowIcon>
                  <FlowLabel $color="#7B1FA2">토토노우</FlowLabel>
                  <FlowSub>황홀경</FlowSub>
                </FlowStep>
              </TotonoFlow>
              <TotonoDesc>
                단순히 뜨거운 공간을 버티는 게 아닙니다. 사우나로 체온을 올리고, 냉탕으로 급격히 낮춘 뒤,
                바깥 공기 속에서 휴식을 취하면 자율신경이 균형을 되찾으며 뇌가 맑아지고
                온몸이 가볍게 뜨는 듯한 감각이 찾아옵니다. 이 상태가 바로 '토토노우'입니다.
                젊은 세대에게 사우나는 단순한 목욕이 아닌, <strong>정신을 맑게 세팅하는 의식</strong>이 되었습니다.
              </TotonoDesc>
            </TotonoBody>
          </TotonoCard>
        </SectionInner>
      </TotonoSection>

      {/* ── 키워드 4종 ── */}
      <KeywordsSection>
        <SectionInner>
          <SectionLabel>Key Trends</SectionLabel>
          <SectionTitle>일본 사우나 붐을 이끈 4대 트렌드</SectionTitle>
          <KeywordGrid>
            {KEYWORDS.map((k) => (
              <KeywordCard key={k.jp} $accent={k.accent}>
                <KeywordIcon $color={k.iconColor}>{k.icon}</KeywordIcon>
                <KeywordJp>{k.jp}</KeywordJp>
                <KeywordKr>{k.kr}</KeywordKr>
                <KeywordDesc>{k.desc}</KeywordDesc>
              </KeywordCard>
            ))}
          </KeywordGrid>
        </SectionInner>
      </KeywordsSection>

      {/* ── 인용구 ── */}
      <QuoteSection>
        <SectionInner>
          <SectionLabel style={{ color: 'rgba(255,255,255,0.4)' }}>Why It Matters</SectionLabel>
          <QuoteTitle>이 흐름이 한국으로 오고 있다</QuoteTitle>
          <QuoteBlock>
            <QuoteText>
              요즘 일본 Z세대가 퇴근 후 술집 대신 사우나로 향하는 이유, 바로{' '}
              <strong>'토토노우(整う, 정돈됨)'</strong>의 마법 때문입니다.
              핀란드에서 시작된 이 건강한 휴식이 일본을 거쳐 이제 한국에서도
              새로운 라이프스타일로 피어나고 있습니다.
              여러분도 오늘, 복잡한 생각을 비우고 몸과 마음을 정돈하는 사우나를 경험해 보시는 건 어떨까요?
            </QuoteText>
          </QuoteBlock>
        </SectionInner>
      </QuoteSection>

      {/* ── 굿즈 & 문화 ── */}
      <CultureSection>
        <SectionInner>
          <SectionLabel>Culture & Lifestyle</SectionLabel>
          <SectionTitle>일본 사우나 문화 속 키워드들</SectionTitle>
          <CultureGrid>
            {CULTURE_ITEMS.map((c) => (
              <CultureCard key={c.title}>
                <CultureIconWrap $color={c.color}>{c.icon}</CultureIconWrap>
                <CultureTitle>
                  <RiCheckLine size={14} style={{ marginRight: 5, verticalAlign: 'middle', color: '#A62121' }} />
                  {c.title}
                </CultureTitle>
                <CultureDesc>{c.desc}</CultureDesc>
              </CultureCard>
            ))}
          </CultureGrid>
        </SectionInner>
      </CultureSection>

      {/* ── CTA ── */}
      <CtaSection>
        <CtaTitle>나만의 토토노우를<br />경험해 보세요</CtaTitle>
        <CtaSub>지금 내 주변의 사우나를 찾아보고, 첫 번째 정돈의 순간을 만나보세요.</CtaSub>
        <CtaBtn href="/search?category=sauna">
          사우나 찾기 <RiArrowRightLine size={18} />
        </CtaBtn>
      </CtaSection>

      <Footer />
    </PageWrap>
  );
}
