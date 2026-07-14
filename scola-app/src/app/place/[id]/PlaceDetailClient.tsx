'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import {
  RiMapPin2Line, RiPhoneLine, RiTimeLine, RiGlobalLine, RiArrowLeftLine,
  RiCarLine, RiGroupLine, RiTempHotLine, RiStarFill,
  RiCoinLine, RiCheckLine, RiCloseLine, RiSubtractLine,
  RiDropLine, RiFireLine, RiSnowflakeLine,
} from '@remixicon/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReviewsSection from '@/components/place/ReviewsSection';
import NearbyPlacesSection from '@/components/place/NearbyPlacesSection';
import type { Place } from '@/types/place';

const BATH_COLORS: Record<string, string> = {
  온탕: '#E57373', 열탕: '#C62828', 냉탕: '#42A5F5', 노천탕: '#66BB6A',
  약탕: '#AB47BC', 쑥탕: '#66BB6A', 한약탕: '#8D6E63', 소금탕: '#FFA726',
  버블탕: '#29B6F6', 탄산탕: '#26C6DA', 황토탕: '#A1887F', 족욕탕: '#EC407A',
  좌욕탕: '#7E57C2',
};
const SPECIAL_COLORS: Record<string, string> = {
  소금방: '#FFA726', 얼음방: '#29B6F6', 빙설방: '#29B6F6', 아이스배스: '#42A5F5',
  숯가마: '#546E7A', 맥반석방: '#8D6E63', 게르마늄방: '#66BB6A', 편백방: '#81C784',
  황토방: '#A1887F', 불한증막: '#C62828', 한증막: '#EF5350', 불가마: '#F44336',
};
const CATEGORY_LABEL: Record<string, string> = {
  sauna: '사우나', jjimjilbang: '찜질방', spa: '스파',
};

const PageWrap = styled.div`min-height:100vh;background:${({theme})=>theme.colors.gray50};display:flex;flex-direction:column;`;
const Hero = styled.div`width:100%;height:340px;overflow:hidden;background:${({theme})=>theme.colors.dark};position:relative;img{width:100%;height:100%;object-fit:cover;display:block;opacity:0.8;}`;
const HeroOverlay = styled.div`position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.65) 100%);`;
const HeroContent = styled.div`position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:20px 28px;max-width:1100px;margin:0 auto;width:100%;left:50%;transform:translateX(-50%);`;
const BackBtn = styled.button`display:flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(0,0,0,0.45);border:1.5px solid rgba(255,255,255,0.25);border-radius:${({theme})=>theme.radius.full};color:white;font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(8px);align-self:flex-start;transition:background 0.15s;&:hover{background:rgba(0,0,0,0.65);}`;
const HeroMeta = styled.div`display:flex;flex-direction:column;gap:10px;`;
const HeroName = styled.h1`font-size:30px;font-weight:800;color:white;line-height:1.2;text-shadow:0 2px 8px rgba(0,0,0,0.4);`;
const HeroBadges = styled.div`display:flex;gap:6px;flex-wrap:wrap;`;
const HeroBadge = styled.span`padding:4px 12px;border-radius:${({theme})=>theme.radius.full};font-size:12px;font-weight:700;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.3);color:white;backdrop-filter:blur(6px);`;
const HeroPrimaryBadge = styled(HeroBadge)`background:${({theme})=>theme.colors.primary};border-color:${({theme})=>theme.colors.primary};`;
const Content = styled.div`max-width:1100px;margin:0 auto;width:100%;padding:28px 20px 64px;display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:flex-start;@media(max-width:${({theme})=>theme.breakpoints.md}){grid-template-columns:1fr;}`;
const Main = styled.div`display:flex;flex-direction:column;gap:20px;`;
const Sidebar = styled.div`display:flex;flex-direction:column;gap:16px;`;
const Card = styled.div`background:white;border:2px solid ${({theme})=>theme.colors.dark};border-radius:${({theme})=>theme.radius.lg};padding:22px;`;
const SectionTitle = styled.h2`font-size:14px;font-weight:800;color:${({theme})=>theme.colors.gray500};text-transform:uppercase;letter-spacing:0.8px;margin-bottom:14px;display:flex;align-items:center;gap:6px;`;
const InfoList = styled.div`display:flex;flex-direction:column;gap:11px;`;
const InfoRow = styled.div`display:flex;align-items:flex-start;gap:10px;font-size:14px;color:${({theme})=>theme.colors.gray700};line-height:1.55;svg{flex-shrink:0;margin-top:2px;color:${({theme})=>theme.colors.gray400};}a{color:${({theme})=>theme.colors.primary};text-decoration:none;&:hover{text-decoration:underline;}}`;
const HoursDetail = styled.div`display:flex;flex-direction:column;gap:3px;font-size:13px;color:${({theme})=>theme.colors.gray500};margin-top:4px;`;
const TankGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;`;
const TankCard = styled.div<{$color:string}>`border-radius:${({theme})=>theme.radius.md};border:2px solid ${({theme})=>theme.colors.dark};overflow:hidden;`;
const TankTop = styled.div<{$color:string}>`height:5px;background:${({$color})=>$color};`;
const TankBody = styled.div`padding:14px 12px;display:flex;flex-direction:column;align-items:center;gap:6px;`;
const TankName = styled.p`font-size:13px;font-weight:800;color:${({theme})=>theme.colors.dark};`;
const TempBig = styled.p<{$color:string}>`font-size:26px;font-weight:800;color:${({$color})=>$color};line-height:1;`;
const TempUnit = styled.span`font-size:13px;font-weight:600;color:${({theme})=>theme.colors.gray400};`;
const AmenityGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:0;`;
const AmenityRow = styled.div<{$status:'yes'|'no'|'unknown'}>`display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid ${({theme})=>theme.colors.gray100};font-size:13px;font-weight:600;color:${({$status,theme})=>$status==='yes'?theme.colors.dark:theme.colors.gray300};&:nth-child(odd){border-right:1px solid ${({theme})=>theme.colors.gray100};}&:last-child,&:nth-last-child(2):nth-child(odd){border-bottom:none;}`;
const AmenityStatus = styled.span<{$status:'yes'|'no'|'unknown'}>`display:flex;align-items:center;color:${({$status,theme})=>$status==='yes'?theme.colors.success:theme.colors.gray300};`;
const SpecRow = styled.div`display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid ${({theme})=>theme.colors.gray100};&:last-child{border-bottom:none;}`;
const SpecLabel = styled.span`display:flex;align-items:center;gap:8px;font-size:13px;color:${({theme})=>theme.colors.gray500};font-weight:600;`;
const SpecValue = styled.span`font-size:15px;font-weight:800;color:${({theme})=>theme.colors.dark};`;
const PriceRow = styled.div`display:flex;justify-content:space-between;align-items:center;font-size:14px;padding:9px 0;border-bottom:1px solid ${({theme})=>theme.colors.gray100};color:${({theme})=>theme.colors.gray600};&:last-child{border-bottom:none;}strong{color:${({theme})=>theme.colors.dark};font-weight:800;}`;
const ReviewStat = styled.div`display:flex;gap:20px;`;
const ReviewNum = styled.div`display:flex;flex-direction:column;gap:2px;span:first-child{font-size:26px;font-weight:800;color:${({theme})=>theme.colors.dark};}span:last-child{font-size:11px;color:${({theme})=>theme.colors.gray400};font-weight:600;text-transform:uppercase;letter-spacing:0.3px;}`;
const NaverBtn = styled.a`display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:#03C75A;border:1.5px solid #03C75A;border-radius:${({theme})=>theme.radius.full};color:white;font-size:12px;font-weight:700;text-decoration:none;transition:opacity 0.15s;&:hover{opacity:0.88;}`;
const SkeletonHero = styled.div`width:100%;height:340px;background:${({theme})=>theme.colors.gray200};`;
const SkeletonBlock = styled.div<{$h?:string;$w?:string}>`height:${({$h})=>$h??'16px'};width:${({$w})=>$w??'100%'};border-radius:6px;background:${({theme})=>theme.colors.gray100};`;

// ─── 장소 특징 ────────────────────────────────────────────────────────────────
const SignatureText = styled.p`font-size:15px;font-weight:700;color:${({theme})=>theme.colors.dark};font-style:italic;line-height:1.6;padding-bottom:14px;margin-bottom:14px;border-bottom:1px solid ${({theme})=>theme.colors.gray100};`;
const HighlightList = styled.ul`display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none;`;
const HighlightItem = styled.li`display:flex;align-items:flex-start;gap:10px;font-size:14px;color:${({theme})=>theme.colors.gray700};line-height:1.55;&::before{content:'';display:block;width:3px;height:14px;background:${({theme})=>theme.colors.primary};border-radius:2px;flex-shrink:0;margin-top:3px;}`;
const TagRow = styled.div`display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;`;
const Tag = styled.span`padding:4px 10px;font-size:12px;font-weight:700;border:1.5px solid ${({theme})=>theme.colors.dark};border-radius:${({theme})=>theme.radius.full};color:${({theme})=>theme.colors.dark};`;
const ProfileMeta = styled.div`display:flex;flex-direction:column;gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid ${({theme})=>theme.colors.gray100};`;
const ProfileMetaRow = styled.div`display:flex;gap:10px;font-size:13px;line-height:1.55;`;
const ProfileMetaLabel = styled.span`font-weight:800;color:${({theme})=>theme.colors.gray500};white-space:nowrap;min-width:44px;`;
const ProfileMetaValue = styled.span`color:${({theme})=>theme.colors.gray700};`;
const CautionValue = styled(ProfileMetaValue)`color:${({theme})=>theme.colors.danger};`;

// ─── 리뷰 요약 ────────────────────────────────────────────────────────────────
const OverallText = styled.p`font-size:14px;line-height:1.75;color:${({theme})=>theme.colors.gray700};margin-bottom:16px;`;
const ProConGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;@media(max-width:480px){grid-template-columns:1fr;}`;
const ProConBlock = styled.div<{$type:'pro'|'con'}>``;
const ProConLabel = styled.p<{$type:'pro'|'con'}>`font-size:11px;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;color:${({$type,theme})=>$type==='pro'?theme.colors.success:theme.colors.gray400};margin-bottom:8px;`;
const ProConList = styled.ul`margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;`;
const ProConItem = styled.li<{$type:'pro'|'con'}>`font-size:13px;color:${({theme})=>theme.colors.gray700};line-height:1.5;padding-left:12px;position:relative;&::before{content:'';position:absolute;left:0;top:7px;width:5px;height:5px;border-radius:50%;background:${({$type,theme})=>$type==='pro'?theme.colors.success:theme.colors.gray300};}`;
const KeywordRow = styled.div`display:flex;flex-wrap:wrap;gap:5px;margin-bottom:16px;`;
const Keyword = styled.span`padding:3px 9px;font-size:12px;font-weight:600;background:${({theme})=>theme.colors.gray50};border:1px solid ${({theme})=>theme.colors.gray200};border-radius:${({theme})=>theme.radius.full};color:${({theme})=>theme.colors.gray600};`;
const SentimentBar = styled.div`display:flex;height:5px;border-radius:3px;overflow:hidden;margin-bottom:6px;`;
const SentimentSeg = styled.div<{$color:string;$pct:number}>`background:${({$color})=>$color};flex:${({$pct})=>$pct};`;
const SentimentLabels = styled.div`display:flex;justify-content:space-between;font-size:11px;font-weight:600;color:${({theme})=>theme.colors.gray400};margin-bottom:16px;`;
const QuoteList = styled.div`display:flex;flex-direction:column;gap:10px;`;
const Quote = styled.blockquote`margin:0;padding:10px 14px;border-left:3px solid ${({theme})=>theme.colors.primary};background:${({theme})=>theme.colors.gray50};font-size:13px;color:${({theme})=>theme.colors.gray600};line-height:1.65;font-style:italic;border-radius:0 ${({theme})=>theme.radius.sm} ${({theme})=>theme.radius.sm} 0;`;

type AmenityDef = { label: string; key: keyof Place | null };
const AMENITY_DEFS: AmenityDef[] = [
  { label: '24시간', key: 'is_24hours' }, { label: '식당/매점', key: 'has_restaurant' },
  { label: '수면실', key: 'has_sleep_room' }, { label: '마사지', key: 'has_massage' },
  { label: '헬스장', key: 'has_gym' }, { label: '키즈 시설', key: 'kids_facility' },
  { label: '회원권', key: 'membership_available' }, { label: '주차', key: 'parking' },
];

function getStatus(place: Place, def: AmenityDef): 'yes' | 'no' | 'unknown' {
  if (def.key === 'parking') return place.parking ? 'yes' : place.parking === null ? 'unknown' : 'no';
  const val = def.key ? place[def.key] : null;
  if (val === true) return 'yes';
  if (val === false) return 'no';
  return 'unknown';
}

interface Props { place: Place | null; }

export default function PlaceDetailClient({ place }: Props) {
  const router = useRouter();

  if (!place) return (
    <PageWrap>
      <Navbar />
      <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,padding:80 }}>
        <p style={{ fontSize:18, fontWeight:700 }}>장소를 찾을 수 없습니다.</p>
        <button onClick={() => router.back()} style={{ cursor:'pointer', fontSize:14 }}>← 돌아가기</button>
      </div>
      <Footer />
    </PageWrap>
  );

  const thumbSrc = place.thumbnail ?? '/place-placeholder.svg';
  const addr = place.road_address ?? place.address;
  const hasBaths = (place.bath_types?.length ?? 0) > 0;
  const hasSpecialRooms = (place.special_rooms?.length ?? 0) > 0;
  const hasAmenities = (place.amenities?.length ?? 0) > 0;
  const hasPriceTiers = place.price_tiers && Object.keys(place.price_tiers).length > 0;
  const hasSaunaSpec = place.sauna_type || place.sauna_temp || place.hot_bath_temp || place.cold_bath_temp || place.room_count;
  const hasFacilityData = AMENITY_DEFS.some((d) => getStatus(place, d) !== 'unknown');

  const profile = place.place_profile;
  const revSummary = place.review_summary;
  const hasProfile = profile && ((profile.highlights?.length ?? 0) > 0 || profile.signature || profile.atmosphere);
  const hasRevSummary = revSummary && (revSummary.overall || (revSummary.pros?.length ?? 0) > 0);

  return (
    <PageWrap>
      <Navbar />
      <Hero>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbSrc} alt={place.name}
          onError={(e) => { (e.target as HTMLImageElement).src = '/place-placeholder.svg'; }} />
        <HeroOverlay />
        <HeroContent>
          <BackBtn onClick={() => router.back()}><RiArrowLeftLine size={14} /> 목록으로</BackBtn>
          <HeroMeta>
            <HeroName>{place.name}</HeroName>
            <HeroBadges>
              {place.app_category?.map((cat) => <HeroPrimaryBadge key={cat}>{CATEGORY_LABEL[cat] ?? cat}</HeroPrimaryBadge>)}
              {place.gender_type && <HeroBadge>{place.gender_type}</HeroBadge>}
              {place.sauna_type  && <HeroBadge>{place.sauna_type}</HeroBadge>}
              {place.is_24hours  && <HeroBadge>24시간</HeroBadge>}
            </HeroBadges>
          </HeroMeta>
        </HeroContent>
      </Hero>

      <Content>
        <Main>
          <Card>
            <SectionTitle>기본 정보</SectionTitle>
            <InfoList>
              {addr && <InfoRow><RiMapPin2Line size={15} /><span>{addr}</span></InfoRow>}
              {place.phone && <InfoRow><RiPhoneLine size={15} /><a href={`tel:${place.phone}`}>{place.phone}</a></InfoRow>}
              {(place.open_hours ?? place.business_hours) && (
                <InfoRow>
                  <RiTimeLine size={15} />
                  <div>
                    <div>{place.open_hours ?? place.business_hours}</div>
                    {(place.business_hours_detail?.length ?? 0) > 0 && (
                      <HoursDetail>{place.business_hours_detail.map((h, i) => <div key={i}>{h}</div>)}</HoursDetail>
                    )}
                  </div>
                </InfoRow>
              )}
              {place.homepage && <InfoRow><RiGlobalLine size={15} /><a href={place.homepage} target="_blank" rel="noopener noreferrer">{place.homepage}</a></InfoRow>}
              {place.parking && <InfoRow><RiCarLine size={15} /><span>{place.parking}{place.parking_count ? ` (${place.parking_count}대)` : ''}</span></InfoRow>}
              {place.age_restriction && <InfoRow><RiGroupLine size={15} /><span>{place.age_restriction}</span></InfoRow>}
            </InfoList>
            {place.description && (
              <p style={{ marginTop:18,fontSize:14,lineHeight:1.75,color:'#616161',borderTop:'1px solid #f0f0f0',paddingTop:16 }}>{place.description}</p>
            )}
          </Card>

          {hasProfile && (
            <Card>
              <SectionTitle>장소 특징</SectionTitle>
              {profile!.signature && <SignatureText>"{profile!.signature}"</SignatureText>}
              {(profile!.highlights?.length ?? 0) > 0 && (
                <HighlightList>
                  {profile!.highlights.map((h, i) => <HighlightItem key={i}>{h}</HighlightItem>)}
                </HighlightList>
              )}
              {(profile!.recommended_for?.length ?? 0) > 0 && (
                <TagRow style={{ marginTop: 14 }}>
                  {profile!.recommended_for.map((t, i) => <Tag key={i}>{t}</Tag>)}
                </TagRow>
              )}
              {(profile!.atmosphere || profile!.best_time || (profile!.tips?.length ?? 0) > 0 || profile!.caution) && (
                <ProfileMeta>
                  {profile!.atmosphere && (
                    <ProfileMetaRow>
                      <ProfileMetaLabel>분위기</ProfileMetaLabel>
                      <ProfileMetaValue>{profile!.atmosphere}</ProfileMetaValue>
                    </ProfileMetaRow>
                  )}
                  {profile!.best_time && (
                    <ProfileMetaRow>
                      <ProfileMetaLabel>방문 팁</ProfileMetaLabel>
                      <ProfileMetaValue>{profile!.best_time}</ProfileMetaValue>
                    </ProfileMetaRow>
                  )}
                  {(profile!.tips?.length ?? 0) > 0 && (
                    <ProfileMetaRow>
                      <ProfileMetaLabel>꿀팁</ProfileMetaLabel>
                      <ProfileMetaValue>{profile!.tips.join(' · ')}</ProfileMetaValue>
                    </ProfileMetaRow>
                  )}
                  {profile!.caution && (
                    <ProfileMetaRow>
                      <ProfileMetaLabel>주의</ProfileMetaLabel>
                      <CautionValue>{profile!.caution}</CautionValue>
                    </ProfileMetaRow>
                  )}
                </ProfileMeta>
              )}
            </Card>
          )}

          {hasSaunaSpec && (
            <Card>
              <SectionTitle><RiTempHotLine size={14} /> 사우나 정보</SectionTitle>
              {place.sauna_type && <SpecRow><SpecLabel>종류</SpecLabel><SpecValue>{place.sauna_type}</SpecValue></SpecRow>}
              {place.room_count && <SpecRow><SpecLabel>방 개수</SpecLabel><SpecValue>{place.room_count}개</SpecValue></SpecRow>}
              {place.sauna_temp && <SpecRow><SpecLabel><RiFireLine size={14} color="#EF5350" /> 사우나 온도</SpecLabel><SpecValue style={{color:'#C62828'}}>{place.sauna_temp}</SpecValue></SpecRow>}
              {place.hot_bath_temp && <SpecRow><SpecLabel><RiDropLine size={14} color="#E57373" /> 온탕 온도</SpecLabel><SpecValue style={{color:'#E57373'}}>{place.hot_bath_temp}</SpecValue></SpecRow>}
              {place.cold_bath_temp && <SpecRow><SpecLabel><RiSnowflakeLine size={14} color="#42A5F5" /> 냉탕 온도</SpecLabel><SpecValue style={{color:'#42A5F5'}}>{place.cold_bath_temp}</SpecValue></SpecRow>}
            </Card>
          )}

          {hasBaths && (
            <Card>
              <SectionTitle><RiDropLine size={14} /> 탕 종류</SectionTitle>
              <TankGrid>
                {place.bath_types.map((name) => {
                  const color = BATH_COLORS[name] ?? '#9E9E9E';
                  return (
                    <TankCard key={name} $color={color}>
                      <TankTop $color={color} />
                      <TankBody>
                        <TankName>{name}</TankName>
                        {(name === '냉탕' && place.cold_bath_temp) && <TempBig $color={color}>{place.cold_bath_temp.replace('°C','')}<TempUnit>°C</TempUnit></TempBig>}
                        {((name === '온탕' || name === '열탕') && place.hot_bath_temp) && <TempBig $color={color}>{place.hot_bath_temp.replace('°C','')}<TempUnit>°C</TempUnit></TempBig>}
                      </TankBody>
                    </TankCard>
                  );
                })}
              </TankGrid>
            </Card>
          )}

          {hasSpecialRooms && (
            <Card>
              <SectionTitle><RiFireLine size={14} /> 특수 시설</SectionTitle>
              <TankGrid>
                {place.special_rooms.map((name) => {
                  const color = SPECIAL_COLORS[name] ?? '#9E9E9E';
                  return (
                    <TankCard key={name} $color={color}>
                      <TankTop $color={color} />
                      <TankBody><TankName>{name}</TankName></TankBody>
                    </TankCard>
                  );
                })}
              </TankGrid>
            </Card>
          )}

          {(hasFacilityData || hasAmenities) && (
            <Card>
              <SectionTitle>편의시설</SectionTitle>
              <AmenityGrid>
                {AMENITY_DEFS.map((def) => {
                  const status = getStatus(place, def);
                  return (
                    <AmenityRow key={def.label} $status={status}>
                      <span>{def.label}</span>
                      <AmenityStatus $status={status}>
                        {status === 'yes' ? <RiCheckLine size={15} /> : status === 'no' ? <RiCloseLine size={15} /> : <RiSubtractLine size={15} />}
                      </AmenityStatus>
                    </AmenityRow>
                  );
                })}
                {(place.amenities ?? []).filter((a) => !AMENITY_DEFS.some((d) => d.label === a)).map((a) => (
                  <AmenityRow key={a} $status="yes">
                    <span>{a}</span>
                    <AmenityStatus $status="yes"><RiCheckLine size={15} /></AmenityStatus>
                  </AmenityRow>
                ))}
              </AmenityGrid>
            </Card>
          )}

          {hasRevSummary && (
            <Card>
              <SectionTitle>방문자 리뷰 요약</SectionTitle>
              {revSummary!.overall && <OverallText>{revSummary!.overall}</OverallText>}

              {((revSummary!.pros?.length ?? 0) > 0 || (revSummary!.cons?.length ?? 0) > 0) && (
                <ProConGrid>
                  {(revSummary!.pros?.length ?? 0) > 0 && (
                    <ProConBlock $type="pro">
                      <ProConLabel $type="pro">장점</ProConLabel>
                      <ProConList>
                        {revSummary!.pros.map((p, i) => <ProConItem key={i} $type="pro">{p}</ProConItem>)}
                      </ProConList>
                    </ProConBlock>
                  )}
                  {(revSummary!.cons?.length ?? 0) > 0 && (
                    <ProConBlock $type="con">
                      <ProConLabel $type="con">아쉬운 점</ProConLabel>
                      <ProConList>
                        {revSummary!.cons.map((c, i) => <ProConItem key={i} $type="con">{c}</ProConItem>)}
                      </ProConList>
                    </ProConBlock>
                  )}
                </ProConGrid>
              )}

              {(revSummary!.keywords?.length ?? 0) > 0 && (
                <KeywordRow>
                  {revSummary!.keywords.map((k, i) => <Keyword key={i}>{k}</Keyword>)}
                </KeywordRow>
              )}

              {revSummary!.sentiment_breakdown && (() => {
                const { positive, neutral, negative } = revSummary!.sentiment_breakdown!;
                return (
                  <>
                    <SentimentBar>
                      <SentimentSeg $color="#22C55E" $pct={positive} />
                      <SentimentSeg $color="#D4D4D4" $pct={neutral} />
                      <SentimentSeg $color="#EF4444" $pct={negative} />
                    </SentimentBar>
                    <SentimentLabels>
                      <span>긍정 {positive}%</span>
                      <span>중립 {neutral}%</span>
                      <span>부정 {negative}%</span>
                    </SentimentLabels>
                  </>
                );
              })()}

              {(revSummary!.representative_reviews?.length ?? 0) > 0 && (
                <QuoteList>
                  {revSummary!.representative_reviews.map((q, i) => <Quote key={i}>{q}</Quote>)}
                </QuoteList>
              )}
            </Card>
          )}

          <ReviewsSection placeId={place.id} />
        </Main>

        <Sidebar>
          <Card>
            {(place.visitor_review_count || place.blog_review_count) && (
              <>
                <SectionTitle><RiStarFill size={13} color="#EAB308" /> 네이버 리뷰</SectionTitle>
                <ReviewStat style={{ marginBottom:14 }}>
                  {place.visitor_review_count && <ReviewNum><span>{place.visitor_review_count.toLocaleString()}</span><span>방문자</span></ReviewNum>}
                  {place.blog_review_count && <ReviewNum><span>{place.blog_review_count.toLocaleString()}</span><span>블로그</span></ReviewNum>}
                </ReviewStat>
              </>
            )}
            <NaverBtn href={`https://map.naver.com/p/entry/place/${place.naver_place_id}`} target="_blank" rel="noopener noreferrer">
              <RiMapPin2Line size={13} /> 네이버 지도에서 보기
            </NaverBtn>
          </Card>

          {(hasPriceTiers || (place.price_info?.length ?? 0) > 0 || place.admission_fee) && (
            <Card>
              <SectionTitle><RiCoinLine size={14} /> 입장료</SectionTitle>
              {place.admission_fee && !hasPriceTiers && <p style={{ fontSize:16,fontWeight:800,marginBottom:8 }}>{place.admission_fee}</p>}
              {hasPriceTiers && Object.entries(place.price_tiers).map(([tier, price]) => <PriceRow key={tier}><span>{tier}</span><strong>{price as string}</strong></PriceRow>)}
              {!hasPriceTiers && (place.price_info ?? []).map((line, i) => <p key={i} style={{ fontSize:13,color:'#616161',marginBottom:4 }}>{line}</p>)}
            </Card>
          )}
        </Sidebar>
      </Content>
      <NearbyPlacesSection currentPlaceId={place.id} address={place.road_address ?? place.address} />
      <Footer />
    </PageWrap>
  );
}
