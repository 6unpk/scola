'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoSrc from '@/assets/logo.png';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Search, User, LogOut, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const POPULAR_SEARCHES = [
  '용산 불한증막', '부산 해운대', '사우나', '찜질방', '스파', '황토방',
  '불한증막', '냉탕', '수영장', '24시간', '서울', '경기',
];

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
      { label: '핀란드식 사우나 즐기기', href: '/guide/finland', desc: '뢸뤼·비흐타·아반토의 세계' },
      { label: '일본식 사우나 즐기기', href: '/guide/japan', desc: '토토노우·사우너·사메시 문화' },
    ],
  },
];

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

const NavSearchWrap = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.1);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition: border-color 0.15s, background 0.15s;
  width: 100%;

  &:focus-within {
    background: rgba(255,255,255,0.15);
    border-color: ${({ theme }) => theme.colors.primary};
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
  padding: 8px 14px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white};
  min-width: 0;

  &::placeholder {
    color: rgba(255,255,255,0.45);
  }
`;

const SearchBtn = styled.button`
  padding: 8px 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const NavRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
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

  &:hover {
    border-color: rgba(255,255,255,0.4);
  }
`;

const NavBtnPrimary = styled(NavBtn)`
  background: ${({ theme }) => theme.colors.primary};
  border-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const MenuBar = styled.div`
  border-top: 1px solid rgba(255,255,255,0.1);
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

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuthStore();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navSearchRef = useRef<HTMLDivElement>(null);

  const suggestions = query.trim()
    ? POPULAR_SEARCHES.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : POPULAR_SEARCHES.slice(0, 6);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navSearchRef.current && !navSearchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectSuggestion = (s: string) => {
    setQuery(s);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(s)}`);
  };

  return (
    <Nav>
      <TopBar>
        <Logo href="/">
          <LogoImg src={logoSrc} alt="Scola" width={200} height={60} priority />
        </Logo>

        <NavSearchWrap ref={navSearchRef}>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              placeholder="사우나, 찜질방, 지역 검색..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
            />
            <SearchBtn type="submit">
              <Search size={16} />
            </SearchBtn>
          </SearchForm>

          {showSuggestions && (
            <NavSuggestionsBox>
              <NavSuggestionsHeader>
                {query.trim() ? '추천 검색어' : '인기 검색어'}
              </NavSuggestionsHeader>
              {suggestions.map((s) => (
                <NavSuggestionItem key={s} type="button" onClick={() => handleSelectSuggestion(s)}>
                  {query.trim()
                    ? <Search size={13} style={{ color: '#9E9E9E', flexShrink: 0 }} />
                    : <TrendingUp size={13} style={{ color: '#A62121', flexShrink: 0 }} />
                  }
                  <span>{s}</span>
                </NavSuggestionItem>
              ))}
            </NavSuggestionsBox>
          )}
        </NavSearchWrap>

        <NavRight>
          {token ? (
            <>
              <NavBtn style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
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
              <NavBtn onClick={() => router.push('/login')}>로그인</NavBtn>
              <NavBtnPrimary onClick={() => router.push('/register')}>회원가입</NavBtnPrimary>
            </>
          )}
        </NavRight>
      </TopBar>

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
  );
}
