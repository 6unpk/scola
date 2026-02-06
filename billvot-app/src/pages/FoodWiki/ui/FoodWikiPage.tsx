import { useState, useEffect, useCallback, useRef } from "react";

import { useNavigate } from "react-router-dom";

import MainHeader from "@app/components/MainHeader";
import { styled } from "@app/styles";
import { ingredientService } from "@app/api/rest/services";
import SearchIcon from "@app/assets/search.svg?react";
import { useSafeArea } from "@app/hooks/useSafeArea";

import type { Ingredient } from "@app/api/rest/types";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "#F7F9FA",
  display: "flex",
  flexDirection: "column",
});

const HeaderContainer = styled("div", {
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: "white",
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
});

const HeroSection = styled("div", {
  backgroundColor: "#013D21",
  padding: "64px 16px 40px 16px",
});

const HeroTitle = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "1.193359375em",
  color: "#15D278",
  textAlign: "center",
  marginBottom: "16px",
});

const SearchBarContainer = styled("div", {
  backgroundColor: "#FFFFFF",
  border: "1px solid #15D278",
  borderRadius: "6px",
  padding: "8px",
  marginBottom: "8px",
});

const SearchBarInner = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const SearchIconWrapper = styled("div", {
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const SearchInput = styled("input", {
  flex: 1,
  border: "none",
  outline: "none",
  fontFamily: "Pretendard",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "1.193359375em",
  color: "#6C7680",
  "&::placeholder": {
    color: "#6C7680",
  },
});

const HeroSubtext = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "1.193359375em",
  color: "#FFFFFF",
  textAlign: "center",
  marginBottom: "24px",
});

const CategoryFiltersContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "4px",
});

const CategoryFiltersRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  justifyContent: "center",
});

const CategoryChip = styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  padding: "6px 8px",
  borderRadius: "40px",
  border: "1px solid",
  fontFamily: "Pretendard",
  fontSize: "10px",
  lineHeight: "1.193359375em",
  cursor: "pointer",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",

  variants: {
    selected: {
      true: {
        backgroundColor: "rgba(21, 210, 120, 0.16)",
        borderColor: "#15D278",
        color: "#15D278",
        fontWeight: 600,
      },
      false: {
        backgroundColor: "rgba(41, 46, 51, 0.16)",
        borderColor: "#FFFFFF",
        color: "#FFFFFF",
        fontWeight: 400,
      },
    },
  },
});

const ContentSection = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  padding: "16px",
});

const AlphabetNavContainer = styled("div", {
  width: "100%",
  maxWidth: "288px",
  backgroundColor: "#FFFFFF",
  borderRadius: "16px",
  boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.12)",
  padding: "55px 37px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  alignItems: "center",
});

const AlphabetNavRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "24px",
});

const AlphabetButton = styled("button", {
  fontFamily: "Pretendard",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "1.193359375em",
  color: "#525C66",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  transition: "color 0.2s ease",

  variants: {
    active: {
      true: {
        fontWeight: 700,
        color: "#15D278",
      },
    },
  },

  "&:hover": {
    color: "#15D278",
  },
});

const LangToggleContainer = styled("div", {
  display: "flex",
  gap: "12px",
  padding: "4px",
  backgroundColor: "#DAE0E6",
  borderRadius: "10px",
});

const LangToggleButton = styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  padding: "4px 16px",
  borderRadius: "8px",
  border: "none",
  fontFamily: "Pretendard",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "1.193359375em",
  cursor: "pointer",
  transition: "all 0.2s ease",

  variants: {
    active: {
      true: {
        backgroundColor: "#FFFFFF",
        color: "#292E33",
      },
      false: {
        backgroundColor: "transparent",
        color: "#525C66",
      },
    },
  },
});

const IngredientListContainer = styled("div", {
  width: "100%",
  maxWidth: "288px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const IngredientCard = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  padding: "57px 0px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #15D278",
  borderRadius: "16px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  
  "&:hover": {
    backgroundColor: "#F0FDF4",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
});

const IngredientNameMain = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "1.193359375em",
  color: "#15D278",
});

const IngredientNameSub = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 500,
  fontSize: "12px",
  color: "#525C66",
  opacity: 0.8,
});

const LoadingText = styled("div", {
  textAlign: "center",
  color: "#6B7280",
  fontSize: "14px",
  padding: "40px 20px",
});

const EmptyState = styled("div", {
  textAlign: "center",
  padding: "60px 20px",
  color: "#6B7280",
});

const EmptyStateTitle = styled("div", {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "8px",
  color: "#374151",
});

const EmptyStateDescription = styled("div", {
  fontSize: "14px",
  lineHeight: "1.5",
});

const LoadMoreTrigger = styled("div", {
  height: "20px",
  width: "100%",
});

const categoryOptions = [
  "전체",
  "보존료",
  "착색료",
  "향료",
  "감미료",
  "산미료",
  "산화방지제",
];

const alphabetRows = [
  ["A", "B", "C", "D", "E", "F", "G"],
  ["H", "I", "J", "K", "L", "M"],
  ["N", "O", "P", "Q", "R", "S", "T"],
  ["U", "V", "W", "X", "Y", "Z"],
];

const koreanConsonants = [
  ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ"],
  ["ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"],
];

// 서버 측에서 초성/알파벳 필터링 처리하므로 더 이상 사용하지 않음
// const getKoreanInitial = (text: string): string => {
//   const firstChar = text.charAt(0);
//   const charCode = firstChar.charCodeAt(0);
//
//   if (charCode >= 0xac00 && charCode <= 0xd7a3) {
//     const initialCode = Math.floor((charCode - 0xac00) / 0x24c) + 0x1100;
//     return String.fromCharCode(initialCode);
//   }
//
//   return firstChar;
// };

function FoodWikiPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedAlphabet, setSelectedAlphabet] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "ko">("ko");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useSafeArea();

  const loadIngredients = useCallback(
    async (pageNum: number, reset = false, initial?: string) => {
      if (isLoading || (!hasMore && !reset)) return;

    setIsLoading(true);
    try {
        let response;
        if (initial) {
          response = await ingredientService.filterByInitial(
            initial,
            pageNum,
            20,
          );
        } else {
          response = await ingredientService.getIngredients(pageNum, 20);
        }

        if (reset) {
          setIngredients(response.result as any);
        } else {
          setIngredients((prev) => [...prev, ...(response.result as any)]);
        }
        setHasMore(response.result.length === 20);
    } catch (err) {
      console.error("성분 데이터 로드 중 오류:", err);
        if (reset) {
      setIngredients([]);
        }
    } finally {
      setIsLoading(false);
    }
    },
    [isLoading, hasMore],
  );

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await ingredientService.searchIngredients({
        keyword: query.trim(),
        page: 0,
        size: 100,
      });
      setSearchResults(response.result as any);
    } catch (err) {
      console.error("성분 검색 중 오류:", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedAlphabet) {
      setHasMore(true);
      loadIngredients(0, true, selectedAlphabet);
    } else if (!searchQuery.trim()) {
      setHasMore(true);
      loadIngredients(0, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlphabet]);

  useEffect(() => {
    let currentPage = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          hasMore &&
          !searchQuery.trim()
        ) {
          currentPage += 1;
          loadIngredients(currentPage, false, selectedAlphabet || undefined);
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoading, hasMore, searchQuery, selectedAlphabet, loadIngredients]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const filteredIngredients = (
    searchQuery.trim() ? searchResults : ingredients
  ).filter((ingredient) => {
    if (searchQuery.trim()) {
      return true;
    }
    if (
      selectedCategory !== "전체" &&
      ingredient.ingredientType !== selectedCategory
    ) {
      return false;
    }
    return true;
  });

  return (
    <Container>
      <HeaderContainer>
        <MainHeader
          css={{
            backgroundColor: "white",
            "& svg": {
              fill: "#000000 !important",
            },
          }}
        />
      </HeaderContainer>

      <ScrollableContent>
        <HeroSection>
          <HeroTitle>
            아는 만큼 좋은걸 먹으니까요,
            <br />
            푸드위키
          </HeroTitle>

          <SearchBarContainer>
            <SearchBarInner>
              <SearchIconWrapper>
                <SearchIcon width={20} height={20} />
              </SearchIconWrapper>
              <SearchInput
                type="text"
                placeholder="성분명을 입력해 주세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
              />
            </SearchBarInner>
          </SearchBarContainer>

          <HeroSubtext>
            전문 에디터들이 전하는 식품 성분들 같이 공부해요
          </HeroSubtext>

          <CategoryFiltersContainer>
            <CategoryFiltersRow>
              {categoryOptions.slice(0, 5).map((category) => (
                <CategoryChip
                  key={category}
                  selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </CategoryChip>
              ))}
            </CategoryFiltersRow>
            <CategoryFiltersRow>
              {categoryOptions.slice(5).map((category) => (
                <CategoryChip
                  key={category}
                  selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </CategoryChip>
              ))}
            </CategoryFiltersRow>
          </CategoryFiltersContainer>
        </HeroSection>

        <ContentSection>
          <AlphabetNavContainer>
            {(language === "en" ? alphabetRows : koreanConsonants).map(
              (row, rowIndex) => (
                <AlphabetNavRow key={rowIndex}>
                  {row.map((letter) => (
                    <AlphabetButton
                      key={letter}
                      active={selectedAlphabet === letter}
                      onClick={() =>
                        setSelectedAlphabet(
                          selectedAlphabet === letter ? null : letter,
                        )
                      }
                    >
                      {letter}
                    </AlphabetButton>
                  ))}
                </AlphabetNavRow>
              ),
            )}

            <LangToggleContainer>
              <LangToggleButton
                active={language === "ko"}
                onClick={() => {
                  setLanguage("ko");
                  setSelectedAlphabet(null);
                }}
              >
                국문
              </LangToggleButton>
              <LangToggleButton
                active={language === "en"}
                onClick={() => {
                  setLanguage("en");
                  setSelectedAlphabet(null);
                }}
              >
                영문
              </LangToggleButton>
            </LangToggleContainer>
          </AlphabetNavContainer>

          <IngredientListContainer>
            {filteredIngredients.length === 0 && !isLoading ? (
              <EmptyState>
                <EmptyStateTitle>성분이 없습니다</EmptyStateTitle>
                <EmptyStateDescription>
                  다른 필터를 선택해보세요
                </EmptyStateDescription>
              </EmptyState>
            ) : (
              <>
                {filteredIngredients.map((ingredient) => (
                <IngredientCard
                  key={ingredient.id}
                  onClick={() => navigate(`/main/food-wiki/${ingredient.id}`)}
                >
                  <IngredientNameMain>
                    {ingredient.ingredientName}
                  </IngredientNameMain>
                  {ingredient.englishName && (
                    <IngredientNameSub>
                      {ingredient.englishName}
                    </IngredientNameSub>
                  )}
                </IngredientCard>
                ))}
                {!searchQuery.trim() && hasMore && (
                  <LoadMoreTrigger ref={loadMoreRef} />
                )}
                {isLoading && (
                  <LoadingText>성분 정보를 불러오는 중...</LoadingText>
                )}
              </>
            )}
          </IngredientListContainer>
        </ContentSection>
      </ScrollableContent>
    </Container>
  );
}

export default FoodWikiPage;
