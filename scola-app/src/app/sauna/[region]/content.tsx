'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Star, MapPin, ChevronRight, Map as MapIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LazyImage from '@/components/ui/LazyImage';
import { REGIONS, type RegionInfo } from '@/data/regions';
import type { Place } from '@/types/place';

const CATEGORY_LABEL: Record<string, string> = {
  sauna: '사우나', jjimjilbang: '찜질방', spa: '스파', seshin: '세신샵', hotel: '호텔', waterpark: '워터파크',
};

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

const RegionNav = styled.nav`
  max-width:1100px;margin:24px auto 0;padding:0 20px;display:flex;flex-wrap:wrap;gap:8px;
`;
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

const Grid = styled.div`
  display:grid;grid-template-columns:repeat(3,1fr);gap:18px;
  @media (max-width:${({ theme }) => theme.breakpoints.lg}){grid-template-columns:repeat(2,1fr);}
  @media (max-width:${({ theme }) => theme.breakpoints.sm}){grid-template-columns:1fr;}
`;

const Card = styled(Link)`
  display:flex;flex-direction:column;background:#fff;border:1px solid ${({ theme }) => theme.colors.gray200};
  border-radius:${({ theme }) => theme.radius.lg};overflow:hidden;text-decoration:none;
  box-shadow:0 1px 3px rgba(0,0,0,0.04);transition:transform .15s,box-shadow .15s;
  &:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(0,0,0,0.1);}
`;
const Thumb = styled.div`height:150px;overflow:hidden;`;
const CardBody = styled.div`padding:14px;display:flex;flex-direction:column;gap:6px;`;
const Name = styled.h2`font-size:16px;font-weight:800;color:${({ theme }) => theme.colors.dark};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
const Addr = styled.p`font-size:12px;color:${({ theme }) => theme.colors.gray500};display:flex;align-items:center;gap:3px;overflow:hidden;span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}`;
const Tags = styled.div`display:flex;flex-wrap:wrap;gap:4px;margin-top:2px;`;
const Tag = styled.span`padding:2px 8px;background:${({ theme }) => theme.colors.primaryLight};color:${({ theme }) => theme.colors.primary};border-radius:${({ theme }) => theme.radius.full};font-size:11px;font-weight:600;`;
const Meta = styled.div`display:flex;align-items:center;gap:4px;font-size:12px;color:${({ theme }) => theme.colors.gray500};margin-top:2px;`;

const Empty = styled.p`text-align:center;padding:60px 0;color:${({ theme }) => theme.colors.gray500};`;

// ─── Component ──────────────────────────────────────────────────────────────────

export default function RegionContent({ region, places }: { region: RegionInfo; places: Place[] }) {
  const addr = (p: Place) => p.road_address ?? p.address ?? '';
  const tagsOf = (p: Place) => (p.tags?.length ? p.tags : (p.amenities ?? [])).slice(0, 2);

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
        <Cta href={`/map`}>
          <MapIcon size={16} /> 지도에서 보기 <ChevronRight size={15} />
        </Cta>

        {places.length === 0 ? (
          <Empty>아직 {region.name} 지역에 등록된 장소가 없습니다.</Empty>
        ) : (
          <Grid>
            {places.map((p) => (
              <Card key={p.id} href={`/place/${p.id}`}>
                <Thumb>
                  <LazyImage src={p.thumbnail ?? '/place-placeholder.svg'} fallback="/place-placeholder.svg" alt={`${p.name} - ${region.name} 사우나`} />
                </Thumb>
                <CardBody>
                  <Name>{p.name}</Name>
                  {addr(p) && <Addr><MapPin size={11} /><span>{addr(p)}</span></Addr>}
                  <Tags>
                    {p.app_category?.slice(0, 1).map((c) => <Tag key={c}>{CATEGORY_LABEL[c] ?? c}</Tag>)}
                    {tagsOf(p).map((t) => <Tag key={t}>{t}</Tag>)}
                  </Tags>
                  <Meta>
                    {p.rating ? (
                      <><Star size={13} fill="#EAB308" color="#EAB308" /> {p.rating}
                        <span style={{ color: '#9E9E9E' }}>({(p.review_count ?? p.visitor_review_count ?? 0).toLocaleString()})</span></>
                    ) : (
                      <span style={{ color: '#9E9E9E' }}>리뷰 {(p.visitor_review_count ?? 0).toLocaleString()}개</span>
                    )}
                  </Meta>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </Body>

      <Footer />
    </Page>
  );
}
