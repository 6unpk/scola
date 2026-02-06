import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@app/styles";
import { useSearchBills } from "@app/hooks/api";

const OverlayContainer = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.64)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",

  variants: {
    isOpen: {
      true: {
        opacity: 1,
        pointerEvents: "auto",
      },
      false: {
        opacity: 0,
        pointerEvents: "none",
      },
    },
  },

  transition: "opacity 0.3s ease",
});

const SearchContainer = styled("div", {
  backgroundColor: "transparent",
  padding: "20px",
  paddingTop:
    "calc(20px + var(--safe-area-inset-top, env(safe-area-inset-top)))",
});

const SearchInputContainer = styled("div", {
  position: "relative",
});

const SearchInput = styled("input", {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid #ffffff",
  color: "#ffffff",
  backgroundColor: "transparent",
  borderRadius: "12px",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
  "&::placeholder": {
    color: "#ffffff",
  },
});

const SearchResultsContainer = styled("div", {
  flex: 1,
  backgroundColor: "transparent",
  overflowY: "auto",
  padding: "0 20px",
  paddingBottom:
    "calc(20px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom)))",
});

const ResultItem = styled("div", {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "12px",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});

const ResultTitle = styled("div", {
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 600,
  marginBottom: "8px",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const ResultMeta = styled("div", {
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "13px",
});

const NoResultsText = styled("div", {
  textAlign: "center",
  color: "#ffffff",
  fontSize: "14px",
  padding: "20px",
});

const LoadingText = styled("div", {
  textAlign: "center",
  color: "#ffffff",
  fontSize: "14px",
  padding: "20px",
});

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: results, isLoading } = useSearchBills(debouncedQuery);

  // 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setDebouncedQuery("");
    }
  }, [isOpen]);

  const handleResultClick = (id: number) => {
    onClose();
    navigate(`/bill-voting/${id}`);
  };

  return (
    <OverlayContainer isOpen={isOpen} onClick={onClose}>
      <SearchContainer onClick={(e) => e.stopPropagation()}>
        <SearchInputContainer>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder="법안, 의원명을 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchInputContainer>
      </SearchContainer>

      <SearchResultsContainer onClick={(e) => e.stopPropagation()}>
        {isLoading && debouncedQuery && (
          <LoadingText>검색 중...</LoadingText>
        )}
        {!isLoading && debouncedQuery && results?.length === 0 && (
          <NoResultsText>검색 결과가 없습니다.</NoResultsText>
        )}
        {!isLoading && results && results.length > 0 && (
          results.map((item) => (
            <ResultItem key={item.id} onClick={() => handleResultClick(item.id)}>
              <ResultTitle>{item.title}</ResultTitle>
              <ResultMeta>
                {item.author} · {item.bill_number || "-"}
              </ResultMeta>
            </ResultItem>
          ))
        )}
      </SearchResultsContainer>
    </OverlayContainer>
  );
}

export default SearchOverlay;
