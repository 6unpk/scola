'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoSrc from '@/assets/logo.png';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, LogOut, TrendingUp, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { SUGGESTION_POOL } from '@/data/home';

function sampleRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

const NAV_ITEMS = [
  {
    label: '장소 찾기',
    href: '/search',
    children: [
      { label: '사우나', href: '/search?category=sauna', desc: '전국 사우나 검색' },
      { label: '찜질방', href: '/search?category=jjimjilbang', desc: '전국 찜질방 검색' },
      { label: '스파', href: '/search?category=spa', desc: '전국 스파 검색' },
    ],
  },
  { label: '후기', href: '/reviews' },
  {
    label: '사우나 즐기는 법',
    href: '/guide',
    children: [
      { label: '사우나 즐기기', href: '/guide', desc: '색다른 사우나 철학' },
      { label: '핀란드식 사우나 즐기기', href: '/guide/finland', desc: '뢸뤼·비흐타·아반토의 세계' },
      { label: '일본식 사우나 즐기기', href: '/guide/japan', desc: '토토노우·사우너·사메시 문화' },
    ],
  },
];

// ─── Styled ───────────────────────────────────────────────────────────────────

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.dark};
`;

const TopBar = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
`;

const LogoImg = styled(Image)`
  height: 48px;
  width: auto;
  object-fit: contain;
`;

// 데스크톱 전용 요소
const NavSearchWrap = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.07);
  border: 1.5px solid rgba(255,255,255,0.15);
  border-radius: ${({ theme }) => theme.radius.full};
  transition: border-color 0.15s, background 0.15s;
  width: 100%;
  padding-right: 4px;

  &:focus-within {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.4);
  }
`;

const NavSuggestionsBox = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  z-index: 300;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
`;

const NavSuggestionsHeader = styled.div`
  padding: 10px 14px 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray400};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

const NavSuggestionItem = styled.button`
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.dark};
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.1s;

  & + & { border-top: 1px solid ${({ theme }) => theme.colors.gray50}; }
  &:hover { background: ${({ theme }) => theme.colors.gray50}; }

  span { flex: 1; }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px 8px 16px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white};
  min-width: 0;

  &::placeholder { color: rgba(255,255,255,0.35); }
`;

const SearchBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; }
`;

const NavRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 2px solid transparent;
  color: ${({ theme }) => theme.colors.white};
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover { border-color: rgba(255,255,255,0.4); }
`;

const NavBtnPrimary = styled(NavBtn)`
  background: ${({ theme }) => theme.colors.primary};
  border-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

// 데스크톱 메뉴바
const MenuBar = styled.div`
  border-top: 1px solid rgba(255,255,255,0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MenuInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MenuItem = styled(Link)<{ $active: boolean }>`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : 'rgba(255,255,255,0.7)'};
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  transition: all 0.15s;
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    border-bottom-color: rgba(255,255,255,0.4);
  }
`;

const DropdownWrap = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  &:hover > div { opacity: 1; pointer-events: auto; transform: translateY(0); }
`;

const DropdownTrigger = styled(Link)<{ $active: boolean }>`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : 'rgba(255,255,255,0.7)'};
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  transition: all 0.15s;
  white-space: nowrap;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    border-bottom-color: rgba(255,255,255,0.4);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 220px;
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  z-index: 200;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 0.15s, transform 0.15s;
`;

const DropdownItem = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 16px;
  text-decoration: none;
  transition: background 0.1s;

  & + & { border-top: 1px solid ${({ theme }) => theme.colors.gray100}; }
  &:hover { background: ${({ theme }) => theme.colors.gray50}; }
`;

const DropdownItemLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`;

const DropdownItemDesc = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
`;

// ─── 모바일 요소 ──────────────────────────────────────────────────────────────

const HamburgerBtn = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover { background: rgba(255,255,255,0.1); }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const Overlay = styled(motion.div)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 200;
  }
`;

const Drawer = styled(motion.div)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(320px, 85vw);
    background: ${({ theme }) => theme.colors.dark};
    z-index: 201;
    overflow-y: auto;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const DrawerClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255,255,255,0.08);
  color: white;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const DrawerSearch = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const DrawerSearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.07);
  border: 1.5px solid rgba(255,255,255,0.15);
  border-radius: ${({ theme }) => theme.radius.full};
  padding-right: 4px;

  &:focus-within {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.4);
  }
`;

const DrawerSearchInput = styled.input`
  flex: 1;
  padding: 9px 12px 9px 16px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: white;

  &::placeholder { color: rgba(255,255,255,0.35); }
`;

const DrawerNav = styled.div`
  flex: 1;
  padding: 8px 0;
`;

const DrawerNavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 700;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : 'rgba(255,255,255,0.85)'};
  text-decoration: none;
  border-left: 3px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  transition: all 0.12s;

  &:hover { background: rgba(255,255,255,0.05); }
`;

const DrawerNavGroup = styled.div``;

const DrawerNavGroupBtn = styled.button<{ $active: boolean; $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 700;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : 'rgba(255,255,255,0.85)'};
  background: none;
  border: none;
  border-left: 3px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.12s;

  &:hover { background: rgba(255,255,255,0.05); }

  svg {
    transition: transform 0.2s;
    transform: rotate(${({ $open }) => $open ? '180deg' : '0deg'});
    flex-shrink: 0;
  }
`;

const DrawerSubItems = styled(motion.div)`
  overflow: hidden;
  background: rgba(0,0,0,0.2);
`;

const DrawerSubItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 12px 28px;
  text-decoration: none;
  border-top: 1px solid rgba(255,255,255,0.05);
  transition: background 0.1s;

  &:hover { background: rgba(255,255,255,0.05); }
`;

const DrawerSubItemLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
`;

const DrawerSubItemDesc = styled.span`
  font-size: 12px;
  color: rgba(255,255,255,0.35);
`;

const DrawerFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DrawerLoginBtn = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid rgba(255,255,255,0.3);
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { border-color: white; }
`;

const DrawerRegisterBtn = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; }
`;

const DrawerUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 4px;
`;

const DrawerUserName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DrawerLogoutBtn = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid rgba(255,255,255,0.2);
  background: transparent;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;

  &:hover { border-color: rgba(255,255,255,0.4); color: white; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuthStore();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularSample] = useState(() => sampleRandom(SUGGESTION_POOL, 6));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [mobileQuery, setMobileQuery] = useState('');
  const navSearchRef = useRef<HTMLDivElement>(null);

  const suggestions = query.trim()
    ? SUGGESTION_POOL.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : popularSample;

  // 라우트 변경 시 드로어 닫기
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // 바깥 클릭 시 검색 제안 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navSearchRef.current && !navSearchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 드로어 열릴 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    if (mobileQuery.trim()) router.push(`/search?q=${encodeURIComponent(mobileQuery.trim())}`);
  };

  const handleSelectSuggestion = (s: string) => {
    setQuery(s);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(s)}`);
  };

  const toggleGroup = (href: string) => {
    setOpenGroups((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  return (
    <>
      <Nav>
        <TopBar>
          <Logo href="/">
            <LogoImg src={logoSrc} alt="스콜라" width={200} height={60} priority />
          </Logo>

          {/* 데스크톱 검색 */}
          <NavSearchWrap ref={navSearchRef}>
            <SearchForm onSubmit={handleSearch}>
              <SearchInput
                placeholder="사우나, 찜질방, 지역 검색..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
              />
              <SearchBtn type="submit"><Search size={16} /></SearchBtn>
            </SearchForm>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  style={{ position: 'absolute', width: '100%', zIndex: 300, top: 'calc(100% + 8px)' }}
                >
                  <NavSuggestionsBox style={{ position: 'static' }}>
                    <NavSuggestionsHeader>
                      {query.trim() ? '추천 검색어' : '인기 검색어'}
                    </NavSuggestionsHeader>
                    {suggestions.map((s, i) => (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.13, delay: i * 0.03, ease: 'easeOut' }}
                      >
                        <NavSuggestionItem type="button" onClick={() => handleSelectSuggestion(s)}>
                          {query.trim()
                            ? <Search size={13} style={{ color: '#9E9E9E', flexShrink: 0 }} />
                            : <TrendingUp size={13} style={{ color: '#A62121', flexShrink: 0 }} />
                          }
                          <span>{s}</span>
                        </NavSuggestionItem>
                      </motion.div>
                    ))}
                  </NavSuggestionsBox>
                </motion.div>
              )}
            </AnimatePresence>
          </NavSearchWrap>

          {/* 데스크톱 우측 버튼 */}
          <NavRight>
            {token ? (
              <>
                <NavBtn style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }} onClick={() => router.push('/mypage')}>
                  <User size={14} />
                  {user?.nickname ?? user?.email}
                </NavBtn>
                <NavBtn onClick={() => { logout(); router.push('/'); }}>
                  <LogOut size={14} />
                  로그아웃
                </NavBtn>
              </>
            ) : (
              <>
                <NavBtn onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}>로그인</NavBtn>
                <NavBtnPrimary onClick={() => router.push('/register')}>회원가입</NavBtnPrimary>
              </>
            )}
          </NavRight>

          {/* 모바일 햄버거 */}
          <HamburgerBtn onClick={() => setMobileOpen(true)} aria-label="메뉴 열기">
            <Menu size={22} />
          </HamburgerBtn>
        </TopBar>

        {/* 데스크톱 메뉴바 */}
        <MenuBar>
          <MenuInner>
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <DropdownWrap key={item.href}>
                  <DropdownTrigger href={item.href} $active={pathname.startsWith(item.href)}>
                    {item.label} ▾
                  </DropdownTrigger>
                  <DropdownMenu>
                    {item.children.map((child) => (
                      <DropdownItem key={child.href} href={child.href}>
                        <DropdownItemLabel>{child.label}</DropdownItemLabel>
                        {'desc' in child && <DropdownItemDesc>{child.desc}</DropdownItemDesc>}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </DropdownWrap>
              ) : (
                <MenuItem
                  key={item.href}
                  href={item.href}
                  $active={pathname === item.href.split('?')[0]}
                >
                  {item.label}
                </MenuItem>
              )
            )}
          </MenuInner>
        </MenuBar>
      </Nav>

      {/* 모바일 드로어 */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <Drawer
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: [0.32, 0, 0.24, 1] }}
            >
              {/* 드로어 헤더 */}
              <DrawerHeader>
                <Logo href="/" onClick={() => setMobileOpen(false)}>
                  <LogoImg src={logoSrc} alt="스콜라" width={120} height={36} priority />
                </Logo>
                <DrawerClose onClick={() => setMobileOpen(false)}>
                  <X size={18} />
                </DrawerClose>
              </DrawerHeader>

              {/* 검색 */}
              <DrawerSearch>
                <DrawerSearchForm onSubmit={handleMobileSearch}>
                  <DrawerSearchInput
                    placeholder="사우나, 찜질방, 지역 검색..."
                    value={mobileQuery}
                    onChange={(e) => setMobileQuery(e.target.value)}
                  />
                  <SearchBtn type="submit"><Search size={15} /></SearchBtn>
                </DrawerSearchForm>
              </DrawerSearch>

              {/* 네비게이션 */}
              <DrawerNav>
                {NAV_ITEMS.map((item) =>
                  item.children ? (
                    <DrawerNavGroup key={item.href}>
                      <DrawerNavGroupBtn
                        $active={pathname.startsWith(item.href)}
                        $open={openGroups.includes(item.href)}
                        onClick={() => toggleGroup(item.href)}
                      >
                        {item.label}
                        <ChevronDown size={16} />
                      </DrawerNavGroupBtn>
                      <AnimatePresence initial={false}>
                        {openGroups.includes(item.href) && (
                          <DrawerSubItems
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                          >
                            {item.children.map((child) => (
                              <DrawerSubItem key={child.href} href={child.href}>
                                <div>
                                  <DrawerSubItemLabel>{child.label}</DrawerSubItemLabel>
                                  {'desc' in child && (
                                    <div><DrawerSubItemDesc>{child.desc}</DrawerSubItemDesc></div>
                                  )}
                                </div>
                                <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                              </DrawerSubItem>
                            ))}
                          </DrawerSubItems>
                        )}
                      </AnimatePresence>
                    </DrawerNavGroup>
                  ) : (
                    <DrawerNavItem
                      key={item.href}
                      href={item.href}
                      $active={pathname === item.href.split('?')[0]}
                    >
                      {item.label}
                    </DrawerNavItem>
                  )
                )}
              </DrawerNav>

              {/* 드로어 하단 */}
              <DrawerFooter>
                {token ? (
                  <>
                    <DrawerUserInfo>
                      <User size={16} color="rgba(255,255,255,0.5)" />
                      <DrawerUserName>{user?.nickname ?? user?.email}</DrawerUserName>
                    </DrawerUserInfo>
                    <DrawerLoginBtn onClick={() => { router.push('/mypage'); setMobileOpen(false); }}>
                      마이페이지
                    </DrawerLoginBtn>
                    <DrawerLogoutBtn onClick={() => { logout(); router.push('/'); setMobileOpen(false); }}>
                      <LogOut size={14} />
                      로그아웃
                    </DrawerLogoutBtn>
                  </>
                ) : (
                  <>
                    <DrawerLoginBtn onClick={() => { router.push(`/login?redirect=${encodeURIComponent(pathname)}`); setMobileOpen(false); }}>
                      로그인
                    </DrawerLoginBtn>
                    <DrawerRegisterBtn onClick={() => { router.push('/register'); setMobileOpen(false); }}>
                      회원가입
                    </DrawerRegisterBtn>
                  </>
                )}
              </DrawerFooter>
            </Drawer>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
