'use client';

import styled from 'styled-components';

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
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
    padding: 14px 16px;
    gap: 12px;
    overflow-y: visible;
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
  position: relative;
  background: ${({ theme }) => theme.colors.gray50};
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

export const FieldLabel = styled.p`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.gray500};
  text-transform: uppercase;
  margin-bottom: -6px;
`;
