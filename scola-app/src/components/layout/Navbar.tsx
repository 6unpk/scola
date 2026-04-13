'use client';

import Link from 'next/link';
import logoSrc from '@/assets/logo.png';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, LogOut, TrendingUp, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { SUGGESTION_POOL } from '@/data/home';
import {
  Nav, TopBar, Logo, LogoImg,
  NavSearchWrap, SearchForm, SearchInput, SearchBtn,
  NavSuggestionsBox, NavSuggestionsHeader, NavSuggestionItem,
  NavRight, NavBtn, NavBtnPrimary,
  MenuBar, MenuInner, MenuItem,
  DropdownWrap, DropdownTrigger, DropdownMenu, DropdownItem, DropdownItemLabel, DropdownItemDesc,
  HamburgerBtn, Overlay, Drawer,
  DrawerHeader, DrawerClose, DrawerSearch, DrawerSearchForm, DrawerSearchInput,
  DrawerNav, DrawerNavItem, DrawerNavGroup, DrawerNavGroupBtn,
  DrawerSubItems, DrawerSubItem, DrawerSubItemText, DrawerSubItemLabel, DrawerSubItemDesc,
  DrawerFooter, DrawerLoginBtn, DrawerRegisterBtn,
  DrawerUserInfo, DrawerUserName, DrawerLogoutBtn,
} from './Navbar.styles';

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

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navSearchRef.current && !navSearchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
                <MenuItem key={item.href} href={item.href} $active={pathname === item.href.split('?')[0]}>
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
              <DrawerHeader>
                <Logo href="/" onClick={() => setMobileOpen(false)}>
                  <LogoImg src={logoSrc} alt="스콜라" width={120} height={36} priority />
                </Logo>
                <DrawerClose onClick={() => setMobileOpen(false)}>
                  <X size={18} />
                </DrawerClose>
              </DrawerHeader>

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
                                <DrawerSubItemText>
                                  <DrawerSubItemLabel>{child.label}</DrawerSubItemLabel>
                                  {'desc' in child && (
                                    <DrawerSubItemDesc>{child.desc}</DrawerSubItemDesc>
                                  )}
                                </DrawerSubItemText>
                                <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                              </DrawerSubItem>
                            ))}
                          </DrawerSubItems>
                        )}
                      </AnimatePresence>
                    </DrawerNavGroup>
                  ) : (
                    <DrawerNavItem key={item.href} href={item.href} $active={pathname === item.href.split('?')[0]}>
                      {item.label}
                    </DrawerNavItem>
                  )
                )}
              </DrawerNav>

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
