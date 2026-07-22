'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { ChevronRight, Map as MapIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PlaceCardItem from '@/components/place/PlaceCardItem';
import { REGIONS, type RegionInfo } from '@/data/regions';
import type { Place } from '@/types/place';

// ─── Styled ───────────────────────────────────────────────────────────────────

const Page = styled.div`min-height:100vh;background:${({ theme }) => theme.colors.gray50};display:flex;flex-direction:column;`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.dark};
  padding: 56px 20px 40px;
  color: #fff;
`;
const HeaderInner = styled.div`max-width:1100px;margin:0 auto;`;
const Kicker = styled.p`font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${({ theme }) => theme.colors.primary};margin-bottom:12px;`;
const H1 = styled.h1`font-size:clamp(26px,5vw,40px);font-weight:900;line-height:1.2;margin-bottom:12px;`;
const Blurb = styled.p`font-size:15px;line-height:1.7;color:rgba(255,255,255,0.7);max-width:640px;`;
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

const Cta = styled(Link)`
  display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;padding:11px 20px;
  background:${({ theme }) => theme.colors.white};border:1.5px solid ${({ theme }) => theme.colors.gray200};
  border-radius:${({ theme }) => theme.radius.md};font-size:14px;font-weight:700;color:${({ theme }) => theme.colors.dark};text-decoration:none;
  &:hover{border-color:${({ theme }) => theme.colors.primary};color:${({ theme }) => theme.colors.primary};}
`;

// minmax(0,1fr): 1fr(=minmax(auto,1fr))은 아이템 min-content보다 작아지지 못해
// 긴 장소명(nowrap)이 있으면 모바일에서 트랙이 화면을 넘침 → 0으로 최소폭 해제
const Grid = styled.div`
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;
  @media (max-width:${({ theme }) => theme.breakpoints.lg}){grid-template-columns:repeat(2,minmax(0,1fr));}
  @media (max-width:${({ theme }) => theme.breakpoints.sm}){grid-template-columns:minmax(0,1fr);}
`;

// PlaceCardItem을 감싸는 크롤 가능한 링크 (grid 셀을 채움)
const CardLink = styled(Link)`display:block;text-decoration:none;min-width:0;max-width:100%;`;

const Empty = styled.p`text-align:center;padding:60px 0;color:${({ theme }) => theme.colors.gray500};`;

// ─── Component ──────────────────────────────────────────────────────────────────

export default function RegionContent({ region, places }: { region: RegionInfo; places: Place[] }) {
  return (
    <Page>
      <Navbar />

      <Header>
        <HeaderInner>
          <Kicker>전국 사우나 지도 · {region.name}</Kicker>
          <H1>{region.name} 사우나·찜질방·스파 추천</H1>
          <Blurb>{region.blurb}</Blurb>
          {places.length > 0 && (
            <Count>{region.name} 지역 <strong>{places.length.toLocaleString()}곳</strong> 수록</Count>
          )}
        </HeaderInner>
      </Header>

      <RegionNav aria-label="지역 선택">
        {REGIONS.map((r) => (
          <RegionChip key={r.slug} href={`/sauna/${r.slug}`} $active={r.slug === region.slug}>
            {r.name}
          </RegionChip>
        ))}
      </RegionNav>

      <Body>
        <Cta href="/map">
          <MapIcon size={16} /> 지도에서 보기 <ChevronRight size={15} />
        </Cta>

        {places.length === 0 ? (
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
      </Body>

      <Footer />
    </Page>
  );
}
