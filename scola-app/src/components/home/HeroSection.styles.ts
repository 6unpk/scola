import styled from 'styled-components';
import { motion } from 'motion/react';

// ─── Hero 배경 ────────────────────────────────────────────────────────────────

export const Hero = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dark} 0%, ${({ theme }) => theme.colors.primaryDark} 50%, ${({ theme }) => theme.colors.primary} 100%);
  padding: 80px 20px 100px;
  position: relative;
`;

export const AuroraWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

export const Orb = styled(motion.div)<{ $size: number; $color: string }>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  filter: blur(80px);
  opacity: 0.55;
  will-change: transform;
`;

export const HeroBgDecor = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  font-size: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  letter-spacing: -8px;
  color: white;
  overflow: hidden;
  white-space: nowrap;
`;

// ─── Hero 콘텐츠 ──────────────────────────────────────────────────────────────

export const HeroInner = styled.div`
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

export const HeroLogo = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(32px, 6vw, 56px);
  font-family: var(--font-bagel-fat-one), sans-serif;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.2;
  margin-bottom: 12px;
`;

export const HeroSubtitle = styled.p`
  font-size: 17px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 36px;
  font-weight: 400;
`;

// ─── 검색창 ───────────────────────────────────────────────────────────────────

export const HeroSearchWrap = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`;

export const HeroSearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.97);
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 6px 6px 6px 0;
`;

export const CategoryBtn = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
  min-width: 130px;
  justify-content: space-between;

  svg {
    transition: transform 0.2s;
    transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'none'};
    color: ${({ theme }) => theme.colors.gray400};
  }
`;

export const CategoryDropdownBox = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  z-index: 200;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
`;

export const CategoryOptionItem = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 11px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? '700' : '500'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.dark};
  background: ${({ $active, theme }) => $active ? theme.colors.primaryLight : 'white'};
  border: none;
  cursor: pointer;
  transition: background 0.1s;

  & + & { border-top: 1px solid ${({ theme }) => theme.colors.gray100}; }
  &:hover { background: ${({ theme }) => theme.colors.gray50}; }
`;

export const SearchDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.gray300};
  flex-shrink: 0;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  font-size: 15px;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.dark};
  min-width: 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
    font-weight: 400;
  }
`;

export const SearchBtn = styled.button`
  padding: 11px 22px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; }
`;

export const SuggestionsBox = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  z-index: 200;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
`;

export const SuggestionsHeader = styled.div`
  padding: 10px 16px 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray400};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

export const SuggestionItem = styled.button`
  width: 100%;
  padding: 11px 16px;
  text-align: left;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.dark};
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.1s;

  & + & { border-top: 1px solid ${({ theme }) => theme.colors.gray50}; }
  &:hover { background: ${({ theme }) => theme.colors.gray50}; }

  span { flex: 1; }
`;

// ─── 배너 ─────────────────────────────────────────────────────────────────────

export const HeroBannerRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

export const HeroBannerCard = styled.button<{ $bg: string }>`
  flex: 0 0 220px;
  height: 110px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1.5px solid rgba(255,255,255,0.15);
  background: ${({ $bg }) => $bg};
  cursor: pointer;
  overflow: hidden;
  position: relative;
  text-align: left;
  transition: border-color 0.15s, transform 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

export const HeroBannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const HeroBannerTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

export const HeroBannerTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
  display: block;
`;

export const HeroBannerSub = styled.span`
  font-size: 11px;
  color: rgba(255,255,255,0.6);
`;
