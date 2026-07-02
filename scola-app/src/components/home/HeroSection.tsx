'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, TrendingUp } from 'lucide-react';
import { CATEGORY_OPTIONS, SUGGESTION_POOL } from '@/data/home';
import { recordSearch, fetchPopularSearches, mergeSuggestions, shuffledPool } from '@/lib/search';
import {
  Hero, AuroraWrapper, Orb, HeroBgDecor, HeroInner,
  HeroTitle, HeroSubtitle,
  HeroSearchWrap, HeroSearchForm, CategoryBtn, CategoryDropdownBox, CategoryOptionItem,
  SearchDivider, SearchInput, SearchBtn,
  SuggestionsBox, SuggestionsHeader, SuggestionItem,
  HeroBannerRow,
} from './HeroSection.styles';

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [hardcodedPool] = useState(() => shuffledPool());
  const [realPopular, setRealPopular] = useState<string[]>([]);

  useEffect(() => { fetchPopularSearches(6).then(setRealPopular); }, []);

  const popularSample = useMemo(
    () => mergeSuggestions(realPopular, hardcodedPool, 6),
    [realPopular, hardcodedPool],
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
    recordSearch(query);
    const params = new URLSearchParams({ q: query.trim() });
    if (category) params.set('category', category);
    router.push(`/search?${params.toString()}`);
  };

  const handleSelectSuggestion = (s: string) => {
    setQuery(s);
    setShowSuggestions(false);
    recordSearch(s);
    const params = new URLSearchParams({ q: s });
    if (category) params.set('category', category);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Hero>
      <AuroraWrapper>
        <Orb
          $size={500} $color="rgba(166,33,33,0.5)"
          animate={{ x: [0, 80, -40, 60, 0], y: [0, -60, 80, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-10%', left: '-5%' }}
        />
        <Orb
          $size={420} $color="rgba(89,21,21,0.6)"
          animate={{ x: [0, -70, 50, -40, 0], y: [0, 80, -50, 60, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ top: '30%', right: '-8%' }}
        />
        <Orb
          $size={360} $color="rgba(200,60,20,0.35)"
          animate={{ x: [0, 60, -80, 30, 0], y: [0, -40, 60, -70, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          style={{ bottom: '-15%', left: '30%' }}
        />
        <Orb
          $size={280} $color="rgba(130,10,50,0.4)"
          animate={{ x: [0, -50, 70, -30, 0], y: [0, 60, -40, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{ top: '10%', left: '50%' }}
        />
      </AuroraWrapper>
      <HeroBgDecor>♨️</HeroBgDecor>

      <HeroInner>
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

        <HeroBannerRow />
      </HeroInner>
    </Hero>
  );
}
