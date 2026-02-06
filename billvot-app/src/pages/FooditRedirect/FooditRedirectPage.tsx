import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fooditService, articleService } from "@app/api/rest/services";
import { styled } from "@app/styles";

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
});

const LoadingText = styled("div", {
  fontSize: "16px",
  color: "#6B7280",
});

function FooditRedirectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToCorrectPage = async () => {
      if (!id) {
        navigate("/main/feed");
        return;
      }

      try {
        // 먼저 푸디터(에디터 아티클)로 시도
        try {
          await fooditService.getFoodit(id);
          // 성공하면 푸디터 상세로 이동
          navigate(`/article/${id}`, { replace: true });
          return;
        } catch (fooditError) {
          // 푸디터가 아니면 뉴스기사로 시도
          console.log("푸디터가 아님, 뉴스기사 확인 중...");
        }

        // 뉴스기사로 시도
        try {
          await articleService.getArticle(id);
          // 성공하면 뉴스기사 상세로 이동
          navigate(`/food-news/${id}`, { replace: true });
          return;
        } catch (articleError) {
          console.error("뉴스기사도 아님:", articleError);
        }

        // 둘 다 실패하면 홈으로
        setError("콘텐츠를 찾을 수 없습니다.");
        setTimeout(() => {
          navigate("/main/feed", { replace: true });
        }, 2000);
      } catch (error) {
        console.error("리다이렉트 중 오류:", error);
        setError("오류가 발생했습니다.");
        setTimeout(() => {
          navigate("/main/feed", { replace: true });
        }, 2000);
      }
    };

    redirectToCorrectPage();
  }, [id, navigate]);

  return (
    <Container>
      <LoadingText>
        {error || "페이지를 불러오는 중..."}
      </LoadingText>
    </Container>
  );
}

export default FooditRedirectPage;
