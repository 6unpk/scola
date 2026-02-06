import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainHeader from "../../../components/MainHeader";
import { styled } from "../../../styles";

import PopularNewsBanner from "./PopularNewsBanner";
import TopNewsCards from "./TopNewsCards";
import NewsFeed from "./NewsFeed";

const Container = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
});

const ScrollableContent = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingBottom: "calc(80px + env(safe-area-inset-bottom))", // 바텀바 높이 + SafeArea
});

function FoodNewsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <MainHeader
        // 헤더 스타일을 흰색 배경, 검은색 아이콘으로 변경
        css={{
          backgroundColor: "white",
          "& svg": {
            fill: "#000000 !important",
          },
        }}
      />

      <ScrollableContent>
        {/* 인기 푸드뉴스 배너 */}
        <PopularNewsBanner />

        {/* 주간 TOP5 */}
        <TopNewsCards />

        {/* 뉴스피드 */}
        <NewsFeed />
      </ScrollableContent>
    </Container>
  );
}

export default FoodNewsPage;
