'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoSrc from '@/assets/logo.png';
import styled from 'styled-components';
import { REGIONS } from '@/data/regions';

const NAV_LINKS = [
  { label: '장소 찾기', href: '/search' },
  { label: '지도', href: '/map' },
  { label: '매거진', href: '/posts' },
  { label: '후기', href: '/reviews' },
  { label: '사우나 즐기는 법', href: '/guide' },
  { label: '핀란드식 가이드', href: '/guide/finland' },
  { label: '일본식 가이드', href: '/guide/japan' },
];

const FooterWrap = styled.footer`
  background: ${({ theme }) => theme.colors.dark};
  border-top: 2px solid ${({ theme }) => theme.colors.primaryDark};
  margin-top: auto;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 20px 40px;
  display: grid;
  grid-template-columns: 220px 1fr 1.5fr;
  gap: 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const BrandCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LogoImg = styled(Image)`
  height: 44px;
  width: auto;
  object-fit: contain;
  opacity: 0.9;
`;

const BrandDesc = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  line-height: 1.65;
`;

const NavCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const NavTitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const NavList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 24px;
  list-style: none;
`;

const NavLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.colors.white}; }
`;

const Divider = styled.div`border-top: 1px solid rgba(255,255,255,0.07);`;

const BusinessInfo = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BusinessRow = styled.p`
  font-size: 11px;
  color: rgba(255,255,255,0.22);
  line-height: 1.7;

  span {
    display: inline-block;
    margin-right: 16px;
  }

  strong {
    font-weight: 600;
    color: rgba(255,255,255,0.3);
  }
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid rgba(255,255,255,0.05);
`;

const Copyright = styled.p`
  font-size: 12px;
  color: rgba(255,255,255,0.22);
`;

const BottomLinks = styled.div`display: flex; gap: 16px;`;

const BottomLink = styled(Link)`
  font-size: 12px;
  color: rgba(255,255,255,0.22);
  text-decoration: none;
  &:hover { color: rgba(255,255,255,0.5); }
`;

export default function Footer() {
  return (
    <FooterWrap>
      <FooterInner>
        <BrandCol>
          <Link href="/">
            <LogoImg src={logoSrc} alt="Scola" width={160} height={50} />
          </Link>
          <BrandDesc>
            전국 사우나 · 찜질방 · 스파 정보를<br />한눈에 탐색하세요.
          </BrandDesc>
        </BrandCol>

        <NavCol>
          <NavTitle>메뉴</NavTitle>
          <NavList>
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </NavList>
        </NavCol>

        <NavCol>
          <NavTitle>지역별 사우나</NavTitle>
          <NavList>
            {REGIONS.map((r) => (
              <li key={r.slug}>
                <NavLink href={`/sauna/${r.slug}`}>{r.name}</NavLink>
              </li>
            ))}
          </NavList>
        </NavCol>
      </FooterInner>

      <Divider />

      <BusinessInfo>
        <BusinessRow>
          <span><strong>상호명</strong> 아온미디어</span>
          <span><strong>대표자</strong> 박준우</span>
          <span><strong>사업자등록번호</strong> 855-12-02-532</span>
          <span><strong>통신판매업신고번호</strong> 제2025-고양덕양구-0737호</span>
        </BusinessRow>
        <BusinessRow>
          <span><strong>주소</strong> 경기도 고양시 덕양구 향동로 218, 1125호</span>
          <span><strong>이메일</strong> aonmedia@aonmedia.net</span>
        </BusinessRow>
        <BusinessRow>
          본 사이트에 게재된 정보는 이용자의 편의를 위해 제공되며, 실제 영업 상태와 다를 수 있습니다.
        </BusinessRow>
      </BusinessInfo>

      <BottomBar>
        <Copyright>© 2026 Scola. All rights reserved.</Copyright>
        <BottomLinks>
          <BottomLink href="/privacy">개인정보처리방침</BottomLink>
          <BottomLink href="/terms">이용약관</BottomLink>
        </BottomLinks>
      </BottomBar>
    </FooterWrap>
  );
}
