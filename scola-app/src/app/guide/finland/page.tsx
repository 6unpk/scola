'use client';

import Link from 'next/link';
import styled from 'styled-components';
import {
  RiArrowLeftLine, RiFireLine, RiLeafLine, RiSnowflakeLine,
  RiDropLine, RiCheckLine, RiArrowRightLine,
  RiMoonLine, RiCloseLine, RiShieldLine, RiInformationLine,
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
    background: radial-gradient(ellipse at 60% 40%, rgba(166,33,33,0.25) 0%, transparent 70%);
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

// ── 키워드 3종 ──
const KeywordsSection = styled.section`
  background: ${({ theme }) => theme.colors.gray50};
  padding: 64px 20px;
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

const SectionTitle = styled.h2`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 40px;
  line-height: 1.3;
`;

const KeywordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const KeywordCard = styled.div<{ $accent: string }>`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-top: 5px solid ${({ $accent }) => $accent};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 24px;
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

const KeywordFinnish = styled.p`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  font-style: italic;
  margin-bottom: 4px;
`;

const KeywordKorean = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 14px;
`;

const KeywordDesc = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray600};
`;

// ── 단계별 가이드 ──
const StepsSection = styled.section`
  padding: 72px 20px;
  background: white;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const StepItem = styled.div`
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

const StepNum = styled.div`
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

const StepContent = styled.div`flex: 1;`;

const StepTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 6px;
`;

const StepDesc = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray600};
`;

const StepTip = styled.div`
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

// ── 한국 vs 핀란드 비교 ──
const CompareSection = styled.section`
  background: ${({ theme }) => theme.colors.dark};
  padding: 72px 20px;
`;

const CompareTitle = styled(SectionTitle)`
  color: white;
`;

const CompareTable = styled.div`
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const CompareHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: rgba(255,255,255,0.08);
  border-bottom: 2px solid rgba(255,255,255,0.15);
`;

const CompareHeaderCell = styled.div`
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255,255,255,0.5);
  &:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.1); }
`;

const CompareRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  &:last-child { border-bottom: none; }
`;

const CompareCell = styled.div<{ $highlight?: boolean }>`
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ $highlight }) => $highlight ? 'white' : 'rgba(255,255,255,0.55)'};
  font-weight: ${({ $highlight }) => $highlight ? 700 : 400};
  &:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.08); }
`;

const HighlightDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.colors.primary};
`;

// ── 에티켓 ──
const EtiquetteSection = styled.section`
  padding: 72px 20px;
  background: ${({ theme }) => theme.colors.gray50};
`;

const EtiquetteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const EtiquetteCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
`;

const EtiquetteIconWrap = styled.div<{ $color: string }>`
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

const EtiquetteTitle = styled.h3`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 8px;
`;

const EtiquetteDesc = styled.p`
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const KEYWORDS = [
  {
    finnish: 'Löyly',
    korean: '뢸뤼',
    accent: '#C62828',
    icon: <RiFireLine size={22} />,
    iconBg: '#C62828',
    desc: '달궈진 사우나 스톤 위에 물을 뿌려 만드는 촉촉하고 묵직한 수증기. 바짝 마른 열기가 아니라 이 증기가 몸을 감싸는 것이 핀란드식의 핵심입니다.',
  },
  {
    finnish: 'Vihta',
    korean: '비흐타',
    accent: '#388E3C',
    icon: <RiLeafLine size={22} />,
    iconBg: '#388E3C',
    desc: '자작나무 가지를 묶어 만든 다발. 온몸을 가볍게 두드리면 혈액순환이 촉진되고, 사우나 안에 상쾌한 숲 향기가 퍼집니다.',
  },
  {
    finnish: 'Avanto',
    korean: '아반토',
    accent: '#1565C0',
    icon: <RiSnowflakeLine size={22} />,
    iconBg: '#1565C0',
    desc: '뜨거운 사우나 직후 차가운 물이나 얼음 호수에 뛰어드는 냉수욕. 극적인 온냉 반복이 몸의 긴장을 완전히 해소해 줍니다.',
  },
];

const STEPS = [
  {
    title: '입실 전 샤워',
    desc: '사우나에 들어가기 전 가벼운 샤워로 몸을 깨끗이 합니다. 핀란드에서는 전통적으로 나체로 입실하지만, 한국 공공장소에서는 수영복이나 개인 면 수건을 활용하면 됩니다.',
    tip: null,
  },
  {
    title: '자리 잡고 몸 데우기',
    desc: '나무 벤치에 앉아 몸이 천천히 열을 흡수하도록 둡니다. 처음엔 아래 칸, 익숙해지면 위 칸으로 올라가세요. 열기는 위로 갈수록 강합니다.',
    tip: null,
  },
  {
    title: '뢸뤼 타임',
    desc: '국자로 뜨거운 돌 위에 물을 조금씩 뿌려 수증기를 만듭니다. 함께 있는 사람에게 "뢸뤼 해도 될까요?" 묻는 것이 핀란드식 에티켓입니다.',
    tip: '원하면 물에 소량의 에센셜 오일(타르, 자작나무) 을 섞어도 좋습니다',
  },
  {
    title: '쿨다운',
    desc: '10~15분 후 밖으로 나와 시원한 공기를 맞으며 천천히 식힙니다. 찬물 샤워, 냉탕, 또는 눈밭이 있다면 그 위에 눕는 것이 가장 핀란드식입니다.',
    tip: null,
  },
  {
    title: '반복 & 수분 보충',
    desc: '위 과정을 2~3회 반복합니다. 라운드 사이사이엔 충분히 수분을 보충하세요. 핀란드인들은 이 시간에 시원한 맥주나 롱 드링크(Lonkero)를 즐깁니다.',
    tip: '총 사우나 시간은 1~2시간이 적당',
  },
];

const COMPARE_ROWS = [
  { category: '습도', korea: '건조한 열기 위주', finland: '뢸뤼로 촉촉한 증기 유지' },
  { category: '복장', korea: '찜질복 착용', finland: '개인 면 수건을 깔고 나체' },
  { category: '쿨다운', korea: '바로 냉탕 입수', finland: '자연풍 → 냉수욕 순서로 천천히' },
  { category: '간식', korea: '식혜·구운 계란', finland: '탄산수·맥주·소시지 구이' },
  { category: '분위기', korea: '활기차고 사교적', finland: '정숙하고 명상적' },
];

const ETIQUETTE = [
  {
    icon: <RiMoonLine size={20} />,
    color: '#7B1FA2',
    title: '정숙 유지',
    desc: '사우나는 명상의 공간. 큰 소리보다 조용히 증기 소리에 집중해 보세요.',
  },
  {
    icon: <RiCloseLine size={20} />,
    color: '#C62828',
    title: '온도 경쟁 금지',
    desc: '누가 더 오래 버티나 시합하는 건 핀란드식이 아닙니다. 내 몸이 편안한 만큼만.',
  },
  {
    icon: <RiShieldLine size={20} />,
    color: '#1565C0',
    title: '개인 깔개 사용',
    desc: '나무 벤치에 맨몸이 직접 닿지 않도록 개인 수건이나 깔개를 꼭 사용하세요.',
  },
];

export default function FinlandGuidePage() {
  return (
    <PageWrap>
      <Navbar />

      {/* ── 히어로 ── */}
      <Hero>
        <SectionInner style={{ position: 'relative', zIndex: 1 }}>
          <BackLink href="/guide">
            <RiArrowLeftLine size={13} /> 사우나 즐기는 법
          </BackLink>
          <HeroCountry>Finland</HeroCountry>
          <HeroKicker>Finland Sauna Guide</HeroKicker>
          <HeroTitle>
            영혼을 데우는<br />
            <em>핀란드 사우나</em>의 지혜
          </HeroTitle>
          <HeroSub>
            한국에 찜질방이 있다면, 핀란드에는 사우나가 있습니다.
            핀란드인들에게 사우나는 단순한 목욕탕이 아닌, 성당과도 같은 신성한 휴식처입니다.
          </HeroSub>
        </SectionInner>
      </Hero>

      {/* ── 3대 키워드 ── */}
      <KeywordsSection>
        <SectionInner>
          <SectionLabel>Core Keywords</SectionLabel>
          <SectionTitle>정통 핀란드 사우나의 3대 키워드</SectionTitle>
          <KeywordGrid>
            {KEYWORDS.map((k) => (
              <KeywordCard key={k.finnish} $accent={k.accent}>
                <KeywordIcon $color={k.iconBg}>{k.icon}</KeywordIcon>
                <KeywordFinnish>{k.finnish}</KeywordFinnish>
                <KeywordKorean>{k.korean}</KeywordKorean>
                <KeywordDesc>{k.desc}</KeywordDesc>
              </KeywordCard>
            ))}
          </KeywordGrid>
        </SectionInner>
      </KeywordsSection>

      {/* ── 단계별 가이드 ── */}
      <StepsSection>
        <SectionInner>
          <SectionLabel>How To</SectionLabel>
          <SectionTitle>단계별 이용 가이드</SectionTitle>
          <StepList>
            {STEPS.map((step, i) => (
              <StepItem key={i}>
                <StepNum>{i + 1}</StepNum>
                <StepContent>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDesc>{step.desc}</StepDesc>
                  {step.tip && (
                    <StepTip>
                      <RiDropLine size={12} /> {step.tip}
                    </StepTip>
                  )}
                </StepContent>
              </StepItem>
            ))}
          </StepList>
        </SectionInner>
      </StepsSection>

      {/* ── 비교 테이블 ── */}
      <CompareSection>
        <SectionInner>
          <SectionLabel style={{ color: 'rgba(255,255,255,0.4)' }}>Korea vs Finland</SectionLabel>
          <CompareTitle>한국에서 핀란드식으로 즐기는 법</CompareTitle>
          <CompareTable>
            <CompareHeader>
              <CompareHeaderCell>구분</CompareHeaderCell>
              <CompareHeaderCell>일반 한국 사우나</CompareHeaderCell>
              <CompareHeaderCell>핀란드식으로 즐기기</CompareHeaderCell>
            </CompareHeader>
            {COMPARE_ROWS.map((row) => (
              <CompareRow key={row.category}>
                <CompareCell>
                  <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{row.category}</span>
                </CompareCell>
                <CompareCell>{row.korea}</CompareCell>
                <CompareCell $highlight>
                  <HighlightDot><RiCheckLine size={13} /></HighlightDot>
                  {row.finland}
                </CompareCell>
              </CompareRow>
            ))}
          </CompareTable>

          <div style={{ marginTop: 24, padding: '20px 24px', background: 'rgba(166,33,33,0.15)', border: '1.5px solid rgba(166,33,33,0.4)', borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
              <span style={{ fontWeight: 800, color: '#A62121', display: 'inline-flex', alignItems: 'center', gap: 5 }}><RiInformationLine size={14} /> 한국의 핀란드 사우나 스팟</span>
              {' '}최근 한국에도 숲속 오두막 형태나 강을 바라보며 뢸뤼를 즐길 수 있는 사우나가 늘고 있습니다.
              가평·춘천의 프라이빗 사우나 펜션이나 강원도의 야외 사우나 시설을 이용하면
              아반토 대신 눈밭을 뒹구는 경험도 가능합니다.
            </p>
          </div>
        </SectionInner>
      </CompareSection>

      {/* ── 에티켓 ── */}
      <EtiquetteSection>
        <SectionInner>
          <SectionLabel>Etiquette</SectionLabel>
          <SectionTitle>사우나 에티켓</SectionTitle>
          <EtiquetteGrid>
            {ETIQUETTE.map((e) => (
              <EtiquetteCard key={e.title}>
                <EtiquetteIconWrap $color={e.color}>{e.icon}</EtiquetteIconWrap>
                <EtiquetteTitle>
                  <RiInformationLine size={14} style={{ marginRight: 6, verticalAlign: 'middle', color: '#A62121' }} />
                  {e.title}
                </EtiquetteTitle>
                <EtiquetteDesc>{e.desc}</EtiquetteDesc>
              </EtiquetteCard>
            ))}
          </EtiquetteGrid>
        </SectionInner>
      </EtiquetteSection>

      {/* ── CTA ── */}
      <CtaSection>
        <CtaTitle>지금, 핀란드 감성 사우나를<br />찾아보세요</CtaTitle>
        <CtaSub>스팀 사우나, 뢸뤼 체험 가능한 시설을 바로 검색할 수 있어요.</CtaSub>
        <CtaBtn href="/search?category=sauna">
          사우나 찾기 <RiArrowRightLine size={18} />
        </CtaBtn>
      </CtaSection>

      <Footer />
    </PageWrap>
  );
}
