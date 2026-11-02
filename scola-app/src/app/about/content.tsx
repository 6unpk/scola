'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion, animate, useInView, useReducedMotion } from 'motion/react';
import { RiArrowRightLine } from '@remixicon/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cardBase, cardHover, cardThumbDivider, tagBase } from '@/components/ui/Card';
import type { Place } from '@/types/place';
import {
  PageWrap, SectionInner, HeroTitle,
  IntroSection, IntroTitle, IntroDesc, CtaBtn,
} from '../guide/styles';

const AboutWrap = styled(PageWrap)`
  word-break: keep-all;
`;

const Story = styled.div<{ $reverse?: boolean }>`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
  > figure { order: ${({ $reverse }) => ($reverse ? 1 : 0)}; }
  h2 { font-size: clamp(26px, 3.2vw, 34px); }
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 28px;
    > figure { order: 0; }
  }
`;

const Figure = styled.figure`
  margin: 0;
  img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.dark};
    border-radius: ${({ theme }) => theme.radius.lg};
  }
  figcaption {
    margin-top: 10px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const GraySection = styled(IntroSection)`
  background: ${({ theme }) => theme.colors.gray50};
`;

const Pull = styled.blockquote`
  margin: 36px 0;
  padding: 4px 0 4px 24px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  font-size: clamp(18px, 2.6vw, 22px);
  font-weight: 800;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.dark};
`;

const PullSource = styled.cite`
  display: block;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  color: ${({ theme }) => theme.colors.gray500};
`;

const DarkSection = styled.section`
  padding: 90px 20px;
  background: ${({ theme }) => theme.colors.dark};
  color: white;
`;

const DarkTitle = styled.h2`
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 900;
  line-height: 1.3;
  margin-bottom: 40px;
  em { font-style: normal; color: ${({ theme }) => theme.colors.primary}; }
`;

const DoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const DoCard = styled(Link)`
  ${cardBase}
  ${cardHover}
  display: block;
  text-decoration: none;
`;

const DoShot = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top;
  ${cardThumbDivider}
`;

const DoBody = styled.div`
  padding: 20px 24px 24px;
`;

const DoTitle = styled.p`
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 6px;
`;

const DoDesc = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray500};
`;

const BigNum = styled.p`
  font-size: clamp(48px, 9vw, 80px);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
  margin: 32px 0 8px;
`;

const BigNumLabel = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray500};
`;

const ReviewGrid = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: start;
  @media (max-width: 860px) { grid-template-columns: 1fr; gap: 40px; }
`;

const Sample = styled(Link)`
  ${cardBase}
  ${cardHover}
  display: block;
  text-decoration: none;
`;

const SampleThumb = styled.img`
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
  ${cardThumbDivider}
`;

const SampleBody = styled.div`
  padding: 20px 24px 24px;
`;

const SampleName = styled.p`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
`;

const SampleMeta = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  margin: 4px 0 16px;
`;

const Sentiment = styled.div`
  display: flex;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray100};
  margin-bottom: 6px;
`;

const SentimentBar = styled(motion.div)<{ $color: string }>`
  height: 100%;
  background: ${({ $color }) => $color};
`;

const SentimentLegend = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 18px;
`;

const ListTitle = styled.p`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin: 14px 0 8px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span<{ $muted?: boolean }>`
  ${tagBase}
  font-size: 12px;
  ${({ $muted, theme }) => $muted && `background: ${theme.colors.gray50}; border-color: ${theme.colors.gray300}; color: ${theme.colors.gray600};`}
`;

const CtaSection = styled.section`
  position: relative;
  overflow: hidden;
  padding: 110px 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.dark} url('/guide/hero.webp') center 70% / cover no-repeat;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(13,13,13,0.7) 0%, rgba(13,13,13,0.85) 100%);
  }
`;

const CtaTitle = styled.h2`
  position: relative;
  font-size: clamp(26px, 4.5vw, 40px);
  font-weight: 900;
  color: white;
  margin-bottom: 14px;
  em { font-style: normal; color: ${({ theme }) => theme.colors.primary}; }
`;

const CtaSub = styled.p`
  position: relative;
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 40px;
`;

const CtaRow = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const GhostBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border: 2px solid rgba(255,255,255,0.6);
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 16px;
  font-weight: 800;
  color: white;
  text-decoration: none;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primary}; }
`;

const SmallRow = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 20px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const SmallCard = styled.a`
  ${cardBase}
  ${cardHover}
  display: block;
  padding: 20px 24px;
  text-decoration: none;
`;

const SmallTitle = styled.p`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 4px;
`;

const SmallDesc = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray500};
`;

const AboutHero = styled.section`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dark};
  padding: 140px 20px 120px;
  text-align: center;
`;

const HeroBg = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: url('/guide/hero.webp') center / cover no-repeat;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(13,13,13,0.6) 0%, rgba(13,13,13,0.75) 60%, rgba(13,13,13,0.95) 100%),
      radial-gradient(ellipse at 50% 60%, rgba(166,33,33,0.25) 0%, transparent 60%);
  }
`;

const Etymology = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(12px, 3vw, 32px);
  margin-bottom: 48px;
`;

const Word = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const WordText = styled.span<{ $current?: boolean }>`
  font-size: clamp(22px, 4vw, 34px);
  font-weight: 800;
  color: ${({ $current, theme }) => ($current ? theme.colors.primary : 'rgba(255,255,255,0.85)')};
`;

const WordGloss = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.45);
`;

const Arrow = styled(motion.span)`
  display: flex;
  align-items: center;
  height: clamp(33px, 6vw, 51px);
  color: rgba(255,255,255,0.35);
`;

const Reveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <BigNum ref={ref}>{n.toLocaleString()}</BigNum>;
}

const WORDS = [
  { text: 'σχολή', gloss: '그리스어 / 쉼' },
  { text: 'schola', gloss: '라틴어 / 머무는 자리' },
  { text: '스콜라', gloss: '지금, 여기' },
];

const DOES = [
  { title: '지도와 지역별 목록', desc: '내 주변, 또는 가려는 동네의 사우나, 찜질방을 조건별로 찾습니다.', href: '/map', image: '/about/map.webp' },
  { title: '사우나 가이드', desc: '온탕, 냉탕, 휴식 순서와 핀란드식, 일본식 사우나 문화를 정리했습니다.', href: '/guide', image: '/about/guide.webp' },
  { title: '스콜라 매거진', desc: '지역별 추천과 사우나에 얽힌 역사, 건강 이야기를 씁니다.', href: '/posts', image: '/about/magazine.webp' },
];

export default function AboutPage({ placeCount, sample }: { placeCount: number | null; sample: Place | null }) {
  const reduce = useReducedMotion();
  return (
    <AboutWrap>
      <Navbar />

      <AboutHero>
        <HeroBg
          initial={reduce ? false : { scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 9, ease: 'easeOut' }}
        />
        <SectionInner style={{ position: 'relative', zIndex: 1 }}>
          <Etymology>
            {WORDS.map((w, i) => (
              <Fragment key={w.text}>
                {i > 0 && (
                  <Arrow
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.7 - 0.25, duration: 0.4 }}
                  >
                    <RiArrowRightLine size={22} />
                  </Arrow>
                )}
                <Word
                  initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.3 + i * 0.7, duration: 0.6, ease: 'easeOut' }}
                >
                  <WordText $current={i === WORDS.length - 1}>{w.text}</WordText>
                  <WordGloss>{w.gloss}</WordGloss>
                </Word>
              </Fragment>
            ))}
          </Etymology>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.7, ease: 'easeOut' }}
          >
            <HeroTitle>스콜라는 <em>&apos;쉼&apos;</em>에서 온 말입니다</HeroTitle>
          </motion.div>
        </SectionInner>
      </AboutHero>

      <IntroSection>
        <Story>
          <Figure>
            <img src="/about/athens.webp" alt="라파엘로의 아테네 학당" loading="lazy" />
            <figcaption>라파엘로, 「아테네 학당」, 1509-1511</figcaption>
          </Figure>
          <Reveal>
          <IntroTitle>쉬는 시간이 <em>배움</em>이 됐다</IntroTitle>
          <IntroDesc>
            &apos;스콜라(schola)&apos;의 어원인 그리스어 스콜레(σχολή)는 원래 &apos;여가, 쉼&apos;을 뜻했다.
            일하지 않는 시간에 사람들이 모여 대화하고 생각을 나눴고, 그 시간이 곧 배움이 됐다.
            이 말이 훗날 라틴어 schola를 거쳐 school, 곧 &apos;학교&apos;가 됐다.
          </IntroDesc>
          <IntroDesc>
            플라톤의 아카데메이아와 아리스토텔레스의 뤼케이온도 처음에는 학교가 아니었다.
            몸을 단련하고 씻던 체육장, 김나지온이었다. 땀을 흘리고 쉬던 자리에서 철학이 시작된 셈이다.
          </IntroDesc>
        </Reveal>
        </Story>
      </IntroSection>

      <GraySection>
        <Story $reverse>
          <Figure>
            <img src="/about/caracalla.webp" alt="알마타데마의 카라칼라 욕장" loading="lazy" />
            <figcaption>로렌스 알마타데마, 「카라칼라 욕장」, 1899</figcaption>
          </Figure>
          <Reveal>
          <IntroTitle>목욕탕 한가운데의 <em>머무는 자리</em></IntroTitle>
          <IntroDesc>
            로마의 대형 공중목욕탕 테르마이에는 탕만 있지 않았다. 도서관과 정원, 사람들이 둘러앉아 이야기하는 공간이 함께 있었다.
            건축가 비트루비우스는 온탕실에서 대야(labrum)가 놓인 반원형 공간을 &apos;스콜라&apos;라고 불렀다.
          </IntroDesc>
          <Pull>
            스콜라는 넉넉하게 지어야 한다. 먼저 온 사람들이 자리를 잡아도,
            뒤에 온 사람들이 둘러서서 기다릴 수 있도록.
            <PullSource>비트루비우스, 『건축십서』 5권 10장</PullSource>
          </Pull>
          <IntroDesc>
            씻는 곳이면서 기다리고, 머물고, 이야기하는 곳. 2천 년 전 목욕탕에도 그런 자리가 있었다.
          </IntroDesc>
        </Reveal>
        </Story>
      </GraySection>

      <IntroSection>
        <Story>
          <Figure>
            <img src="/about/kiln.webp" alt="찜질방 불가마" loading="lazy" />
          </Figure>
          <Reveal>
          <IntroTitle>그 자리는 지금도 <em>있습니다</em></IntroTitle>
          <IntroDesc>
            평상에 누워 식혜를 마시고, 맥반석 계란을 까먹고, 수면실에서 한숨 자고 나옵니다.
            세신사가 번호를 부를 때까지 탕 가장자리에 앉아 기다립니다.
            로마 사람들이 스콜라에서 보냈던 시간은 오늘 우리 동네 목욕탕과 찜질방에서도 그대로 흘러갑니다.
          </IntroDesc>
        </Reveal>
        </Story>
      </IntroSection>

      <DarkSection>
        <SectionInner>
          <DarkTitle>스콜라는 당신이 <em>머물 자리</em>를<br />찾아주는 곳입니다</DarkTitle>
          <DoGrid>
            {DOES.map((d) => (
              <DoCard key={d.href} href={d.href}>
                <DoShot src={d.image} alt={`${d.title} 화면`} loading="lazy" />
                <DoBody>
                  <DoTitle>{d.title}</DoTitle>
                  <DoDesc>{d.desc}</DoDesc>
                </DoBody>
              </DoCard>
            ))}
          </DoGrid>
        </SectionInner>
      </DarkSection>

      <IntroSection>
        <ReviewGrid>
          <Reveal>
            <IntroTitle>리뷰를 모아 <em>한눈에</em></IntroTitle>
            <IntroDesc>
              장소마다 방문자 리뷰를 모아 좋은 점과 아쉬운 점, 분위기를 요약합니다.
              요금과 영업시간, 탕 종류와 시설도 한 페이지에서 비교할 수 있게 정리합니다.
            </IntroDesc>
            {placeCount && (
              <>
                <CountUp to={placeCount} />
                <BigNumLabel>스콜라에 등록된 전국 사우나, 찜질방, 목욕탕</BigNumLabel>
              </>
            )}
          </Reveal>
          {sample?.review_summary && (
            <Reveal>
              <Sample href={`/place/${sample.id}`}>
                {sample.thumbnail && <SampleThumb src={sample.thumbnail} alt={sample.name} loading="lazy" />}
                <SampleBody>
                  <SampleName>{sample.name}</SampleName>
                  <SampleMeta>
                    {sample.place_profile?.summary ?? sample.road_address}
                    {sample.visitor_review_count ? `, 방문자 리뷰 ${sample.visitor_review_count.toLocaleString()}건` : ''}
                  </SampleMeta>
                  {sample.review_summary.sentiment_breakdown && (
                    <>
                      <Sentiment>
                        {([
                          ['positive', '#2E7D32'],
                          ['neutral', '#BDBDBD'],
                          ['negative', '#A62121'],
                        ] as const).map(([k, color], i) => (
                          <SentimentBar
                            key={k}
                            $color={color}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${sample.review_summary!.sentiment_breakdown![k]}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
                          />
                        ))}
                      </Sentiment>
                      <SentimentLegend>
                        긍정 {sample.review_summary.sentiment_breakdown.positive}%, 보통 {sample.review_summary.sentiment_breakdown.neutral}%, 부정 {sample.review_summary.sentiment_breakdown.negative}%
                      </SentimentLegend>
                    </>
                  )}
                  <ListTitle>좋은 점</ListTitle>
                  <Tags>
                    {sample.review_summary.pros.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}
                  </Tags>
                  <ListTitle>아쉬운 점</ListTitle>
                  <Tags>
                    {sample.review_summary.cons.slice(0, 2).map((t) => <Tag key={t} $muted>{t}</Tag>)}
                  </Tags>
                </SampleBody>
              </Sample>
            </Reveal>
          )}
        </ReviewGrid>
      </IntroSection>

      <CtaSection>
        <Reveal>
          <CtaTitle>오늘 <em>머물 자리</em>를 찾아보세요</CtaTitle>
          <CtaSub>가까운 사우나에서, 잠깐이라도 쉬어 가세요.</CtaSub>
          <CtaRow>
            <CtaBtn href="/map">내 주변 사우나 찾기 <RiArrowRightLine size={18} /></CtaBtn>
            <GhostBtn href="/guide">사우나 가이드 보기</GhostBtn>
          </CtaRow>
        </Reveal>
      </CtaSection>

      <SmallRow>
        <SmallCard href="https://www.instagram.com/scolakr" target="_blank" rel="noopener noreferrer">
          <SmallTitle>장소 정보 수정/제보</SmallTitle>
          <SmallDesc>정보가 틀렸거나 새로 생긴 곳이 있다면 인스타그램 DM으로 알려주세요.</SmallDesc>
        </SmallCard>
        <SmallCard href="/b2b-event">
          <SmallTitle>제휴 문의</SmallTitle>
          <SmallDesc>사우나, 찜질방 운영자이신가요? 제휴 신청서를 남겨주세요.</SmallDesc>
        </SmallCard>
      </SmallRow>

      <Footer />
    </AboutWrap>
  );
}
