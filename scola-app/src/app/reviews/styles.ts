import styled from 'styled-components';

// ─── 레이아웃 ─────────────────────────────────────────────────────────────────

export const PageWrap = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primaryDark};
  padding: 36px 20px 28px;
`;

export const HeaderInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const HeaderLeft = styled.div``;

export const HeaderKicker = styled.p`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

export const HeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: white;
  line-height: 1.2;
`;

export const HeaderStat = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.4);
  margin-top: 6px;
  strong { color: rgba(255,255,255,0.8); font-weight: 700; }
`;

export const Body = styled.div`
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  padding: 28px 20px 64px;
`;

// ─── 카드 그리드 ──────────────────────────────────────────────────────────────

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const ReviewCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const CardTop = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

export const PlaceThumb = styled.div`
  width: 90px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.gray100};
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

export const PlaceInfo = styled.div`
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
`;

export const PlaceName = styled.button`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

export const PlaceAddr = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Stars = styled.div`
  display: flex;
  gap: 2px;
  margin-top: 2px;
`;

export const CardBody = styled.div`padding: 16px;`;

export const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const Avatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

export const UserName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`;

export const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
`;

// ─── 스켈레톤 ─────────────────────────────────────────────────────────────────

export const SkeletonCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const SkeletonThumb = styled.div`width: 90px; height: 90px; background: ${({ theme }) => theme.colors.gray100};`;

export const SkeletonLine = styled.div<{ $w?: string; $h?: string }>`
  height: ${({ $h }) => $h ?? '13px'};
  width: ${({ $w }) => $w ?? '100%'};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.gray100};
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
  &:hover:not(:disabled) { border-color: ${({ theme }) => theme.colors.primary}; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.gray400};
`;
