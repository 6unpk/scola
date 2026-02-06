import { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { styled } from "@app/styles";
import arrowBack from "@app/assets/arrow_back.svg";
import Close from "@app/assets/close.svg";
import BaseInput from "@app/components/BaseInput";

import { CSS } from "@stitches/react";
import { route } from "@app/pages/route";

const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  height: "54px",
  backgroundColor: "white",
});

const Button = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "$cg900",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "46px",

  "&:disabled": {
    color: "$cg300",
    cursor: "not-allowed",
  },
});

const SearchInputContainer = styled("div", {
  flex: 1,
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
});

interface SearchResultHeaderProps {
  title: string;
  onSearch?: (keyword: string) => void;
  css?: CSS;
}

function SearchResultHeader({ onSearch, css }: SearchResultHeaderProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get("keyword") || "",
  );

  useEffect(() => {
    // URL의 검색어 파라미터가 변경되면 검색 상태 업데이트
    setSearchKeyword(searchParams.get("keyword") || "");
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchKeyword.trim()) {
      // URL 업데이트
      setSearchParams({ keyword: searchKeyword.trim() });
      // 검색 콜백 호출
      onSearch?.(searchKeyword.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchParams({});
  };

  return (
    <HeaderContainer css={css}>
      <Button onClick={() => navigate(route.FEED)}>
        <img src={arrowBack} alt="뒤로가기" width={24} height={24} />
      </Button>
      <SearchInputContainer>
        <BaseInput
          placeholder="검색어를 입력해주세요"
          value={searchKeyword}
          onChange={handleInputChange}
          onKeyDown={handleSearchKeyDown}
        />
      </SearchInputContainer>
      <Button onClick={handleClearSearch}>
        <img src={Close} alt="지우기" width={24} height={24} />
      </Button>
    </HeaderContainer>
  );
}

export default SearchResultHeader;
