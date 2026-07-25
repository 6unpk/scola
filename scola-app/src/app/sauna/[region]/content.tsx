'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { ChevronRight, Map as MapIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PlaceCardItem from '@/components/place/PlaceCardItem';
import LazyImage from '@/components/ui/LazyImage';
import { REGIONS, regionFaqs, type RegionInfo } from '@/data/regions';
import type { Place } from '@/types/place';

const CAT_LABEL: Record<string, string> = {
  sauna: '사우나', jjimjilbang: '찜질방', spa: '스파', seshin: '세신샵', hotel: '호텔', waterpark: '워터파크',
};

// ─── Styled ───────────────────────────────────────────────────────────────────

const Page = styled.div`min-height:100vh;background:${({ theme }) => theme.colors.gray50};display:flex;flex-direction:column;`;

const Hero = styled.header`
  position:relative;overflow:hidden;background:${({ theme }) => theme.colors.dark};color:#fff;
  padding:56px 20px 40px;
`;
const HeroBg = styled.div`position:absolute;inset:0;opacity:0.28;`;
const HeroOverlay = styled.div`position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,13,13,0.55) 0%,rgba(13,13,13,0.9) 100%);`;
const HeroInner = styled.div`position:relative;z-index:1;max-width:1100px;margin:0 auto;`;
const Kicker = styled.p`font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${({ theme }) => theme.colors.primary};margin-bottom:12px;`;
const H1 = styled.h1`font-size:clamp(26px,5vw,40px);font-weight:900;line-height:1.2;margin-bottom:12px;`;
const Blurb = styled.p`font-size:15px;line-height:1.7;color:rgba(255,255,255,0.72);max-width:640px;`;
const Count = styled.p`margin-top:16px;font-size:14px;color:rgba(255,255,255,0.55);strong{color:#fff;font-weight:800;}`;

const RegionNav = styled.nav`max-width:1100px;margin:24px auto 0;padding:0 20px;display:flex;flex-wrap:wrap;gap:8px;`;
const RegionChip = styled(Link)<{ $active?: boolean }>`
  padding:7px 14px;border-radius:${({ theme }) => theme.radius.full};font-size:13px;font-weight:700;text-decoration:none;
  border:1.5px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.gray200)};
  background:${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.white)};
  color:${({ $active, theme }) => ($active ? '#fff' : theme.colors.gray700)};
  &:hover{border-color:${({ theme }) => theme.colors.primary};}
`;

const Body = styled.main`max-width:1100px;margin:0 auto;padding:32px 20px 60px;width:100%;`;

// 서술형 인트로 (SEO 본문)
const Intro = styled.section`
  background:#fff;border:1px solid ${({ theme }) => theme.colors.gray200};border-radius:${({ theme }) => theme.radius.lg};
  padding:24px 26px;margin-bottom:28px;
`;
const IntroP = styled.p`
  font-size:15px;line-height:1.85;color:${({ theme }) => theme.colors.gray700};
  & + & { margin-top:12px; }
  strong { color:${({ theme }) => theme.colors.dark}; font-weight:700; }
`;

const Cta = styled(Link)`
  display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;padding:11px 20px;
  background:${({ theme }) => theme.colors.white};border:1.5px solid ${({ theme }) => theme.colors.gray200};
  border-radius:${({ theme }) => theme.radius.md};font-size:14px;font-weight:700;color:${({ theme }) => theme.colors.dark};text-decoration:none;
  &:hover{border-color:${({ theme }) => theme.colors.primary};color:${({ theme }) => theme.colors.primary};}
`;

const Grid = styled.div`
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;
  @media (max-width:${({ theme }) => theme.breakpoints.lg}){grid-template-columns:repeat(2,minmax(0,1fr));}
  @media (max-width:${({ theme }) => theme.breakpoints.sm}){grid-template-columns:minmax(0,1fr);}
`;
const CardLink = styled(Link)`display:block;text-decoration:none;min-width:0;max-width:100%;`;

const Empty = styled.p`text-align:center;padding:60px 0;color:${({ theme }) => theme.colors.gray500};`;

// FAQ
const SectionTitle = styled.h2`font-size:20px;font-weight:900;color:${({ theme }) => theme.colors.dark};margin:44px 0 16px;`;
const Faq = styled.div`display:flex;flex-direction:column;gap:12px;`;
const FaqItem = styled.div`background:#fff;border:1px solid ${({ theme }) => theme.colors.gray200};border-radius:${({ theme }) => theme.radius.md};padding:18px 20px;`;
const FaqQ = styled.h3`font-size:15px;font-weight:800;color:${({ theme }) => theme.colors.dark};margin-bottom:8px;`;
const FaqA = styled.p`font-size:14px;line-height:1.75;color:${({ theme }) => theme.colors.gray600};`;

// ─── Component ──────────────────────────────────────────────────────────────────

export default function RegionContent({ region, places }: { region: RegionInfo; places: Place[] }) {
  const count = places.length;
  const heroImg = places.find((p) => p.thumbnail)?.thumbnail ?? null;
  const faqs = regionFaqs(region.name, count);

  // 카테고리별 개수 → 인트로 문장
  const catCounts = places.reduce<Record<string, number>>((acc, p) => {
    (p.app_category ?? []).forEach((c) => { acc[c] = (acc[c] ?? 0) + 1; });
    return acc;
  }, {});
  const catSummary = Object.entries(catCounts)
    .filter(([c]) => CAT_LABEL[c])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([c, n]) => `${CAT_LABEL[c]} ${n.toLocaleString()}곳`)
    .join(', ');

  return (
    <Page>
      <Navbar />

      <Hero>
        {heroImg && (
          <HeroBg>
            <LazyImage src={heroImg} alt={`${region.name} 사우나·찜질방`} fallback="/place-placeholder.svg" />
          </HeroBg>
        )}
        <HeroOverlay />
        <HeroInner>
          <Kicker>전국 사우나 지도 · {region.name}</Kicker>
          <H1>{region.name} 사우나·찜질방·스파 추천</H1>
          <Blurb>{region.blurb}</Blurb>
          {count > 0 && (
            <Count>{region.name} 지역 <strong>{count.toLocaleString()}곳</strong> 수록</Count>
          )}
        </HeroInner>
      </Hero>

      <RegionNav aria-label="지역 선택">
        {REGIONS.map((r) => (
          <RegionChip key={r.slug} href={`/sauna/${r.slug}`} $active={r.slug === region.slug}>
            {r.name}
          </RegionChip>
        ))}
      </RegionNav>

      <Body>
        {count > 0 && (
          <Intro>
            <IntroP>
              <strong>{region.name}의 사우나·찜질방·스파</strong>를 한곳에 모았습니다. {region.blurb}{' '}
              스콜라에 등록된 {region.name} 지역 {count.toLocaleString()}곳을 평점과 방문자 리뷰가 좋은 순으로 정리했어요.
            </IntroP>
            <IntroP>
              {catSummary && <>현재 {catSummary} 등이 있으며, </>}
              24시간 운영, 세신·마사지, 수면실, 식당 같은 시설 조건으로 좁혀보고 각 장소의 요금과 실제 이용 후기를 비교해{' '}
              {region.name}에서 가장 잘 맞는 사우나를 찾아보세요. 위치는 <Link href="/map" style={{ color: '#A62121', fontWeight: 700 }}>지도</Link>에서도 한눈에 확인할 수 있습니다.
            </IntroP>
          </Intro>
        )}

        <Cta href="/map">
          <MapIcon size={16} /> 지도에서 보기 <ChevronRight size={15} />
        </Cta>

        {count === 0 ? (
          <Empty>아직 {region.name} 지역에 등록된 장소가 없습니다.</Empty>
        ) : (
          <Grid>
            {places.map((p) => (
              <CardLink key={p.id} href={`/place/${p.id}`} aria-label={`${p.name} - ${region.name} 사우나`}>
                <PlaceCardItem place={p} onClick={() => {}} />
              </CardLink>
            ))}
          </Grid>
        )}

        <SectionTitle>{region.name} 사우나 자주 묻는 질문</SectionTitle>
        <Faq>
          {faqs.map((f) => (
            <FaqItem key={f.q}>
              <FaqQ>{f.q}</FaqQ>
              <FaqA>{f.a}</FaqA>
            </FaqItem>
          ))}
        </Faq>
      </Body>

      <Footer />
    </Page>
  );
}
