'use client';

import styled from 'styled-components';
import Link from 'next/link';

export const PageWrap = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
`;

export const MapBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

export const ControlPanel = styled.aside`
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.gray200};
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    flex-shrink: 0;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
    padding: 10px 14px;
    gap: 8px;
    overflow-y: visible;
  }
`;

// 검색창 + (모바일) 필터 토글 한 줄
export const PanelTop = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// 모바일에서만 보이는 필터 접기/펴기 버튼
export const FilterToggle = styled.button<{ $open: boolean }>`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
    padding: 11px 14px;
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    border: 1.5px solid ${({ $open, theme }) => ($open ? theme.colors.primary : theme.colors.gray200)};
    background: ${({ $open, theme }) => ($open ? theme.colors.primaryLight : theme.colors.white)};
    color: ${({ $open, theme }) => ($open ? theme.colors.primary : theme.colors.gray700)};
  }
`;

// 카테고리/지역 등 나머지 필터 — 모바일에선 접힘(열면 최대 42vh까지만)
export const FilterBody = styled.div<{ $open: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    gap: 12px;
    max-height: 42vh;
    overflow-y: auto;
    padding-top: 2px;
  }
`;

export const PanelTitle = styled.h1`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  flex: 1;
  min-width: 0;
  padding: 11px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.dark};
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  &::placeholder { color: ${({ theme }) => theme.colors.gray400 ?? '#9E9E9E'}; }
`;

export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.button<{ $active: boolean }>`
  padding: 7px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.12s;
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.gray200)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primaryLight : theme.colors.white)};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.gray700)};
`;

export const ResultCount = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  strong { color: ${({ theme }) => theme.colors.primary}; font-weight: 800; }
`;

export const MapArea = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
  background: ${({ theme }) => theme.colors.gray50};

  /* 모바일에서 지도가 화면 대부분을 차지하도록 최소 높이 보장 */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 60vh;
  }
`;

export const MapFallback = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  padding: 24px;
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 14px;

  strong { color: ${({ theme }) => theme.colors.dark}; font-size: 16px; font-weight: 800; }
`;

export const RegionLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const RegionLink = styled(Link)`
  padding: 5px 11px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  color: ${({ theme }) => theme.colors.gray700};
  background: ${({ theme }) => theme.colors.white};
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primary}; }
`;

export const FieldLabel = styled.p`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.gray500};
  text-transform: uppercase;
  margin-bottom: -6px;
`;
