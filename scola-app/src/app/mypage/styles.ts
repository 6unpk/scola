import styled from 'styled-components';

// ─── 레이아웃 ─────────────────────────────────────────────────────────────────

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
`;

export const ProfileHeader = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  padding: 48px 24px 44px;
`;

export const ProfileInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  border: 2px solid rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
`;

export const ProfileInfo = styled.div`flex: 1;`;

export const Nickname = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: white;
  margin-bottom: 4px;
`;

export const EmailRow = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const LogoutBtn = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  background: transparent;
  border: 1.5px solid rgba(255,255,255,0.15);
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  &:hover { color: white; border-color: rgba(255,255,255,0.4); }
`;

export const Body = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

// ─── 설정 카드 ────────────────────────────────────────────────────────────────

export const Card = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const CardHeader = styled.h2`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray400};
  padding: 20px 22px 14px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark};
`;

export const AccordionRow = styled.div`
  & + & { border-top: 1px solid ${({ theme }) => theme.colors.gray100}; }
`;

export const AccordionTrigger = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
  &:hover { background: ${({ theme }) => theme.colors.gray50}; }

  span {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.dark};
  }

  svg.chevron {
    transition: transform 0.2s;
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
    color: ${({ theme }) => theme.colors.gray400};
    flex-shrink: 0;
  }
`;

export const AccordionBody = styled.div`
  padding: 4px 22px 22px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray100};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
`;

export const FieldInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-family: inherit;
  background: white;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  &::placeholder { color: ${({ theme }) => theme.colors.gray400}; }
`;

export const FormMsg = styled.p<{ $error?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $error, theme }) => $error ? theme.colors.danger : '#16a34a'};
`;

export const FormActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const PrimaryBtn = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 13px;
  font-weight: 700;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryHover}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const GhostBtn = styled.button`
  padding: 10px 16px;
  background: white;
  color: ${({ theme }) => theme.colors.dark};
  font-size: 13px;
  font-weight: 600;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.gray50}; }
`;

// ─── 후기 ─────────────────────────────────────────────────────────────────────

export const SectionLabel = styled.h2`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray300};
    text-transform: none;
    letter-spacing: 0;
  }
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ReviewCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  display: flex;
  transition: border-color 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const PlaceThumb = styled.div`
  width: 100px;
  flex-shrink: 0;
  border-right: 2px solid ${({ theme }) => theme.colors.dark};
  background: ${({ theme }) => theme.colors.gray100};
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.2s;
  }
  &:hover img { transform: scale(1.04); }
`;

export const ReviewContent = styled.div`
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const ReviewTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

export const PlaceName = styled.p`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

export const PlaceAddr = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
`;

export const ReviewBody = styled.p`
  font-size: 13px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray700};
`;

export const ReviewFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 2px;
`;

export const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray400};
`;

export const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  background: white;
  border: 1.5px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s;
  &:hover { background: ${({ theme }) => theme.colors.dangerLight}; }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 14px;
  border: 2px dashed ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: white;
  line-height: 1.8;
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
`;

export const PageBtn = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.dark : theme.colors.gray200};
  background: ${({ $active, theme }) => $active ? theme.colors.dark : 'white'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.gray500};
  transition: all 0.12s;

  &:disabled { opacity: 0.35; cursor: not-allowed; }
  &:not(:disabled):hover {
    border-color: ${({ theme }) => theme.colors.dark};
    background: ${({ $active, theme }) => $active ? theme.colors.dark : theme.colors.gray50};
    color: ${({ theme }) => theme.colors.dark};
  }
`;
