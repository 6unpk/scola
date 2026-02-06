import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";

import { faqService, FAQ } from "@foodscanner/shared";

import type { FAQCategory } from "@foodscanner/shared";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
});

const TitleSection = styled("div", {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "stretch",
  alignSelf: "stretch",
  gap: "10px",
  padding: "12px 16px",
});

const Title = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "1.193359375em",
  color: "#12161A",
});

const Content = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingBottom: "env(safe-area-inset-bottom)",
});

const CategoryFilters = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  margin: "16px 0",
  padding: "0 20px",
});

const CategoryButton = styled("button", {
  padding: "8px 16px",
  backgroundColor: "transparent",
  border: "1px solid",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",
  flexShrink: 0,

  variants: {
    selected: {
      true: {
        color: "#000000",
        borderColor: "#000000",
      },
      false: {
        color: "#9CA3AF",
        borderColor: "#E5E7EB",
      },
    },
  },

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
});

const FAQList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "16px",
  paddingBottom: "calc(48px + env(safe-area-inset-bottom, 60px))",
});

const FAQCard = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignSelf: "stretch",
  gap: "8px",
  padding: "16px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #98A5B3",
  borderRadius: "16px",
});

const FAQCategory = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "1.193359375em",
  color: "#525C66",
});

const FAQQuestion = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "1.193359375em",
  color: "#12161A",
});

const Divider = styled("div", {
  width: "100%",
  height: "0px",
  borderTop: "1px solid #98A5B3",
});

const FAQAnswer = styled("div", {
  fontFamily: "Pretendard",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "1.193359375em",
  color: "#12161A",
  whiteSpace: "pre-line",

  variants: {
    collapsed: {
      true: {
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
  },
});

const ExpandButton = styled("button", {
  fontFamily: "Pretendard",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "1.193359375em",
  color: "#525C66",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "8px 0 0 0",
  textAlign: "left",
  textDecoration: "underline",

  "&:hover": {
    color: "#12161A",
  },
});

const EmptyState = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  color: "#9CA3AF",
  fontSize: "14px",
  gap: "8px",
  padding: "40px 20px",
});

const LoadingState = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  color: "#9CA3AF",
  fontSize: "14px",
  padding: "40px 20px",
});

type CategoryOption = "전체" | FAQCategory;

function FAQPage() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption>("전체");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [faqsResponse, categoriesResponse] = await Promise.all([
          faqService.getFAQsList(),
          faqService.getFAQCategories(),
        ]);
        setFaqs(faqsResponse);
        setCategories(categoriesResponse.filter((cat) => cat.isActive));
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("FAQ를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "전체") {
      setFilteredFaqs(faqs);
    } else {
      const categoryId =
        typeof selectedCategory === "object" ? selectedCategory.id : null;
      setFilteredFaqs(
        faqs.filter((faq) => {
          const faqCategory = (faq as FAQ & { category?: FAQCategory | string })
            .category;
          if (typeof faqCategory === "object" && faqCategory?.id) {
            return faqCategory.id === categoryId;
          }
          return false;
        }),
      );
    }
  }, [selectedCategory, faqs]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCategoryClick = (category: CategoryOption) => {
    setSelectedCategory(category);
  };

  const getCategoryName = (
    faq: FAQ & { category?: FAQCategory | string },
  ): string => {
    const category = faq.category;
    if (!category) {
      return categories[0]?.name || "";
    }
    if (typeof category === "string") {
      return category;
    }
    if (typeof category === "object") {
      return (category as FAQCategory).name ?? categories[0]?.name ?? "";
    }
    return categories[0]?.name || "";
  };

  // 렌더링 컨텐츠 결정
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState>로딩 중...</LoadingState>;
    }

    if (error) {
      return <EmptyState>{error}</EmptyState>;
    }

    if (filteredFaqs.length === 0) {
      return <EmptyState>등록된 FAQ가 없습니다.</EmptyState>;
    }

    return (
      <Content>
        <CategoryFilters>
          <CategoryButton
            key="전체"
            selected={selectedCategory === "전체"}
            onClick={() => handleCategoryClick("전체")}
          >
            전체
          </CategoryButton>
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              selected={
                typeof selectedCategory === "object" &&
                selectedCategory.id === category.id
              }
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </CategoryButton>
          ))}
        </CategoryFilters>
        <FAQList>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqs.has(faq.id);
            const answer = faq.answer || (faq as any).content || "";
            const toggleExpand = () => {
              setExpandedFaqs((prev) => {
                const next = new Set(prev);
                if (next.has(faq.id)) {
                  next.delete(faq.id);
                } else {
                  next.add(faq.id);
                }
                return next;
              });
            };

            return (
              <FAQCard key={faq.id}>
                <FAQCategory>{getCategoryName(faq)}</FAQCategory>
                <FAQQuestion>
                  {faq.question || (faq as any).title || ""}
                </FAQQuestion>
                <Divider />
                <FAQAnswer collapsed={!isExpanded}>{answer}</FAQAnswer>
                {answer.length > 60 && (
                  <ExpandButton onClick={toggleExpand}>
                    {isExpanded ? "접기" : "더보기"}
                  </ExpandButton>
                )}
              </FAQCard>
            );
          })}
        </FAQList>
      </Content>
    );
  };

  return (
    <Container>
      <PageHeader
        title="자주 묻는 질문"
        leftButton={{ icon: "back", onClick: handleBack }}
      />
      <TitleSection>
        <Title> FAQ</Title>
      </TitleSection>
      {renderContent()}
    </Container>
  );
}

export default FAQPage;
