import styled from 'styled-components';

// ─── 레이아웃 ─────────────────────────────────────────────────────────────────

export const PageWrap = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const SearchBar = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primaryDark};
  padding: 16px 20px;
`;

export const SearchBarInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SearchInput = styled.input`
  flex: 1;
  max-width: 480px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.1);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 16px;
  color: white;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: rgba(255,255,255,0.4); }
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const ResultCount = styled.p`
  font-size: 15px;
  color: rgba(255,255,255,0.5);
  margin-left: auto;
`;

export const Body = styled.div`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 28px 20px;
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// ─── 필터 사이드바 ────────────────────────────────────────────────────────────

export const Sidebar = styled.aside<{ $mobileOpen: boolean }>`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: sticky;
  top: 120px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    position: static;
    display: ${({ $mobileOpen }) => $mobileOpen ? 'flex' : 'none'};
    background: white;
    border: 2px solid ${({ theme }) => theme.colors.dark};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: 16px;
    margin-bottom: 4px;
  }
`;

export const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const FilterTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ResetBtn = styled.button`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  &:hover { text-decoration: underline; }
`;

export const FilterGroup = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: white;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const FilterGroupHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.gray100};
`;

export const FilterGroupBody = styled.div`
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

// ─── 결과 영역 ────────────────────────────────────────────────────────────────

export const ResultsArea = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;
`;

export const MobileToolbar = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-bottom: 4px;
  }
`;

export const MobileFilterBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 700;
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ $active, theme }) => $active ? theme.colors.primaryLight : 'white'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.dark};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
  white-space: nowrap;
`;

export const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ResultsTitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray600};
  strong { color: ${({ theme }) => theme.colors.dark}; font-weight: 700; }
`;

export const DesktopSort = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// ─── 카드 그리드 ──────────────────────────────────────────────────────────────

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const PlaceCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  min-width: 0;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const CardThumb = styled.div`
  height: 130px;
  overflow: hidden;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark};
`;

export const CardBody = styled.div`padding: 14px;`;

export const CardName = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardAddr = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 10px;
  overflow: hidden;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
`;

export const CardTag = styled.span`
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
`;

export const CardHours = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 8px;
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 15px;
`;

// ─── 스켈레톤 ─────────────────────────────────────────────────────────────────

export const SkeletonCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const SkeletonThumb = styled.div`
  height: 130px;
  background: ${({ theme }) => theme.colors.gray100};
`;

export const SkeletonBody = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SkeletonLine = styled.div<{ $w?: string }>`
  height: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.gray100};
  width: ${({ $w }) => $w ?? '100%'};
`;

// ─── 페이지네이션 ─────────────────────────────────────────────────────────────

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 32px;
`;

export const PageBtn = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.dark};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'white'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.dark};
  cursor: ${({ $active }) => $active ? 'default' : 'pointer'};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ $active, theme }) => $active ? 'white' : theme.colors.primary};
  }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;
