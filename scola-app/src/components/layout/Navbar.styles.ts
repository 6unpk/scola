import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'motion/react';

// ─── TopBar ───────────────────────────────────────────────────────────────────

export const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.dark};
`;

export const TopBar = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
`;

export const LogoImg = styled(Image)`
  height: 48px;
  width: auto;
  object-fit: contain;
`;

// ─── 데스크톱 검색 ────────────────────────────────────────────────────────────

export const NavSearchWrap = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const SearchForm = styled.form`
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

export const NavSuggestionsBox = styled.div`
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

export const NavSuggestionsHeader = styled.div`
  padding: 10px 14px 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray400};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

export const NavSuggestionItem = styled.button`
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

export const SearchInput = styled.input`
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

export const SearchBtn = styled.button`
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

// ─── 데스크톱 우측 버튼 ───────────────────────────────────────────────────────

export const NavRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const NavBtn = styled.button`
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

export const NavBtnPrimary = styled(NavBtn)`
  background: ${({ theme }) => theme.colors.primary};
  border-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

// ─── 데스크톱 메뉴바 ──────────────────────────────────────────────────────────

export const MenuBar = styled.div`
  border-top: 1px solid rgba(255,255,255,0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const MenuInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MenuItem = styled(Link)<{ $active: boolean }>`
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

export const DropdownWrap = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  &:hover > div { opacity: 1; pointer-events: auto; transform: translateY(0); }
`;

export const DropdownTrigger = styled(Link)<{ $active: boolean }>`
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

export const DropdownMenu = styled.div`
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

export const DropdownItem = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 16px;
  text-decoration: none;
  transition: background 0.1s;

  & + & { border-top: 1px solid ${({ theme }) => theme.colors.gray100}; }
  &:hover { background: ${({ theme }) => theme.colors.gray50}; }
`;

export const DropdownItemLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`;

export const DropdownItemDesc = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
`;

// ─── 모바일 요소 ──────────────────────────────────────────────────────────────

export const HamburgerBtn = styled.button`
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

export const Overlay = styled(motion.div)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 200;
  }
`;

export const Drawer = styled(motion.div)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(320px, 85vw);
    max-width: 100vw;
    background: ${({ theme }) => theme.colors.dark};
    z-index: 201;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

export const DrawerClose = styled.button`
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

export const DrawerSearch = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

export const DrawerSearchForm = styled.form`
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

export const DrawerSearchInput = styled.input`
  flex: 1;
  padding: 9px 12px 9px 16px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: white;

  &::placeholder { color: rgba(255,255,255,0.35); }
`;

export const DrawerNav = styled.div`
  flex: 1;
  padding: 8px 0;
`;

export const DrawerNavItem = styled(Link)<{ $active: boolean }>`
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

export const DrawerNavGroup = styled.div``;

export const DrawerNavGroupBtn = styled.button<{ $active: boolean; $open: boolean }>`
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

export const DrawerSubItems = styled(motion.div)`
  overflow: hidden;
  background: rgba(0,0,0,0.2);
`;

export const DrawerSubItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 20px 12px 28px;
  text-decoration: none;
  border-top: 1px solid rgba(255,255,255,0.05);
  transition: background 0.1s;
  overflow: hidden;

  &:hover { background: rgba(255,255,255,0.05); }
`;

export const DrawerSubItemText = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

export const DrawerSubItemLabel = styled.span`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DrawerSubItemDesc = styled.span`
  display: block;
  font-size: 12px;
  color: rgba(255,255,255,0.35);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DrawerFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DrawerLoginBtn = styled.button`
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

export const DrawerRegisterBtn = styled.button`
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

export const DrawerUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 4px;
`;

export const DrawerUserName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DrawerLogoutBtn = styled.button`
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
