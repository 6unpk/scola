'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, TrendingUp } from 'lucide-react';
import logoSrc from '@/assets/logo.png';
import { HERO_BANNERS, CATEGORY_OPTIONS, SUGGESTION_POOL } from '@/data/home';

// ─── Styled Components ────────────────────────────────────────────────────────

const Hero = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dark} 0%, ${({ theme }) => theme.colors.primaryDark} 50%, ${({ theme }) => theme.colors.primary} 100%);
  padding: 80px 20px 100px;
  position: relative;
`;

const AuroraWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Orb = styled(motion.div)<{ $size: number; $color: string }>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  filter: blur(80px);
  opacity: 0.55;
  will-change: transform;
`;

const HeroBgDecor = styled.div`
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

const HeroInner = styled.div`
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HeroLogo = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
`;

const HeroTitle = styled.h1`
  font-size: clamp(32px, 6vw, 56px);
  font-family: var(--font-bagel-fat-one), sans-serif;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.2;
  margin-bottom: 12px;
`;

const HeroSubtitle = styled.p`
  font-size: 17px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 36px;
  font-weight: 400;
`;

// Search

const HeroSearchWrap = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`;

const HeroSearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.97);
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 6px 6px 6px 0;
`;

const CategoryBtn = styled.button<{ $open: boolean }>`
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

const CategoryDropdownBox = styled.div`
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

const CategoryOptionItem = styled.button<{ $active: boolean }>`
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

const SearchDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.gray300};
  flex-shrink: 0;
`;

const SearchInput = styled.input`
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

const SearchBtn = styled.button`
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

const SuggestionsBox = styled.div`
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

const SuggestionsHeader = styled.div`
  padding: 10px 16px 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray400};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

const SuggestionItem = styled.button`
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

// Banners

const HeroBannerRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const HeroBannerCard = styled.button<{ $bg: string }>`
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

const HeroBannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HeroBannerTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const HeroBannerTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
  display: block;
`;

const HeroBannerSub = styled.span`
  font-size: 11px;
  color: rgba(255,255,255,0.6);
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [popularSample] = useState(() =>
    [...SUGGESTION_POOL].sort(() => Math.random() - 0.5).slice(0, 6)
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return popularSample;
    return SUGGESTION_POOL.filter((s) => s.toLowerCase().includes(q)).slice(0, 7);
  }, [query, popularSample]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query.trim() });
    if (category) params.set('category', category);
    router.push(`/search?${params.toString()}`);
  };

  const handleSelectSuggestion = (s: string) => {
    setQuery(s);
    setShowSuggestions(false);
    const params = new URLSearchParams({ q: s });
    if (category) params.set('category', category);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Hero>
      <AuroraWrapper>
        <Orb
          $size={500}
          $color="rgba(166,33,33,0.5)"
          animate={{ x: [0, 80, -40, 60, 0], y: [0, -60, 80, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-10%', left: '-5%' }}
        />
        <Orb
          $size={420}
          $color="rgba(89,21,21,0.6)"
          animate={{ x: [0, -70, 50, -40, 0], y: [0, 80, -50, 60, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ top: '30%', right: '-8%' }}
        />
        <Orb
          $size={360}
          $color="rgba(200,60,20,0.35)"
          animate={{ x: [0, 60, -80, 30, 0], y: [0, -40, 60, -70, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          style={{ bottom: '-15%', left: '30%' }}
        />
        <Orb
          $size={280}
          $color="rgba(130,10,50,0.4)"
          animate={{ x: [0, -50, 70, -30, 0], y: [0, 60, -40, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{ top: '10%', left: '50%' }}
        />
      </AuroraWrapper>
      <HeroBgDecor>♨️</HeroBgDecor>
      <HeroInner>
        {/* <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroLogo>
            <Image src={logoSrc} alt="Scola" width={320} height={100} priority />
          </HeroLogo>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        >
          <HeroTitle>사우나 & 찜질방<br />지금 바로 찾기</HeroTitle>
          <HeroSubtitle>내 주변 사우나, 찜질방, 스파를 한 곳에서 탐색하세요</HeroSubtitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.26 }}
        >
          <HeroSearchWrap ref={wrapRef}>
            <HeroSearchForm onSubmit={handleSearch}>
              <CategoryBtn
                type="button"
                $open={categoryOpen}
                onClick={() => { setCategoryOpen((p) => !p); setShowSuggestions(false); }}
              >
                <span>{CATEGORY_OPTIONS.find((o) => o.value === category)?.label ?? '전체'}</span>
                <ChevronDown size={14} />
              </CategoryBtn>
              <SearchDivider />
              <SearchInput
                placeholder="지역 또는 시설 이름으로 검색..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => { setShowSuggestions(true); setCategoryOpen(false); }}
              />
              <SearchBtn type="submit">
                <Search size={16} />
                검색
              </SearchBtn>
            </HeroSearchForm>

            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  style={{ position: 'absolute', width: '100%', zIndex: 200 }}
                >
                  <CategoryDropdownBox style={{ position: 'static' }}>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <CategoryOptionItem
                        key={opt.value}
                        type="button"
                        $active={category === opt.value}
                        onClick={() => { setCategory(opt.value); setCategoryOpen(false); }}
                      >
                        {opt.label}
                      </CategoryOptionItem>
                    ))}
                  </CategoryDropdownBox>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  style={{ position: 'absolute', width: '100%', zIndex: 200, top: 'calc(100% + 8px)' }}
                >
                  <SuggestionsBox style={{ position: 'static', top: 'unset' }}>
                    <SuggestionsHeader>
                      {query.trim() ? '추천 검색어' : '인기 검색어'}
                    </SuggestionsHeader>
                    {suggestions.map((s, i) => (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15, delay: i * 0.03, ease: 'easeOut' }}
                      >
                        <SuggestionItem type="button" onClick={() => handleSelectSuggestion(s)}>
                          {query.trim()
                            ? <Search size={14} style={{ color: '#9E9E9E', flexShrink: 0 }} />
                            : <TrendingUp size={14} style={{ color: '#A62121', flexShrink: 0 }} />
                          }
                          <span>{s}</span>
                        </SuggestionItem>
                      </motion.div>
                    ))}
                  </SuggestionsBox>
                </motion.div>
              )}
            </AnimatePresence>
          </HeroSearchWrap>
        </motion.div>

        <HeroBannerRow>
          {/* {HERO_BANNERS.map((banner) => (
            <HeroBannerCard key={banner.id} $bg={banner.bg} onClick={() => router.push(banner.href)}>
              <HeroBannerOverlay>
                <HeroBannerTag>{banner.tag}</HeroBannerTag>
                <div>
                  <HeroBannerTitle>{banner.title}</HeroBannerTitle>
                  <HeroBannerSub>{banner.sub}</HeroBannerSub>
                </div>
              </HeroBannerOverlay>
            </HeroBannerCard>
          ))} */}
        </HeroBannerRow>
      </HeroInner>
    </Hero>
  );
}
