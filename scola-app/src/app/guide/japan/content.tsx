'use client';

import {
  RiBookOpenLine, RiMindMap, RiSmartphoneLine, RiGroupLine,
  RiCheckLine, RiArrowRightLine, RiStarSmileLine,
  RiFireLine, RiSnowflakeLine, RiLeafLine, RiSparkling2Line,
  RiShieldLine, RiRestaurantLine,
} from '@remixicon/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  PageWrap, Hero, HeroKicker, HeroTitle, HeroSub, HeroBadge,
  SectionInner, SectionLabel, SectionTitle,
  TotonoSection, TotonoCard, TotonoHeader, TotonoWordJp, TotonoWordKr,
  TotonoHeaderRight, TotonoTagline, TotonoSubTag, TotonoBody, TotonoFlow,
  FlowStep, FlowArrow, FlowIcon, FlowLabel, FlowSub, TotonoDesc,
  KeywordsSection, KeywordGrid, KeywordCard, KeywordIcon, KeywordJp, KeywordKr, KeywordDesc,
  QuoteSection, QuoteTitle, QuoteBlock, QuoteText,
  CultureSection, CultureGrid, CultureCard, CultureIconWrap, CultureTitle, CultureDesc,
  CtaSection, CtaTitle, CtaSub, CtaBtn,
} from './styles';

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
