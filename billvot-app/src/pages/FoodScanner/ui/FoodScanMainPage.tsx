import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";

import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

import { advertisementService, foodSearchService } from "../../../api/rest/services";

interface Advertisement {
  id: string;
  title: string;
  description?: string;
  type: "IMAGE" | "VIDEO";
  mediaUrl: string;
  linkUrl?: string;
  startDate: string;
  endDate: string;
  exposureRatio: number;
  clickCount: number;
  viewCount: number;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt?: string;
  isCurrentlyActive: boolean;
}

// Icons
const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="8.5"
      cy="8.5"
      r="1.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 15L16 10L5 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FileListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 13H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 17H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 21L16.65 16.65"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = () => (
  <svg width="9.6" height="9.6" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path
      d="M12 16V12M12 8H12.01"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  backgroundColor: "rgba(56, 101, 79, 1)",
  position: "relative",
});

const CloseButton = styled("button", {
  position: "absolute",
  top: "40px",
  right: "20px",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  zIndex: 101,
  transition: "all 0.2s ease",

  "&:active": {
    transform: "scale(0.95)",
  },
});

const MainContent = styled("div", {
  flex: 1,
  padding: "80px 16px 40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  minHeight: 0,
});

const StatsLabel = styled("div", {
  fontSize: "16px",
  fontWeight: "400",
  color: "#ffffff",
  textAlign: "center",
  marginBottom: "8px",
});

const StatsNumber = styled("div", {
  fontSize: "36px",
  fontWeight: "bold",
  color: "#ffffff",
  textAlign: "center",
  marginBottom: "24px",
});

const SearchBar = styled("div", {
  width: "calc(100% - 32px)",
  maxWidth: "288px",
  padding: "10px 16px",
  backgroundColor: "rgba(255, 255, 255, 0.24)",
  border: "1px solid #15D278",
  borderRadius: "33px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "24px",
  transition: "all 0.2s ease",

  "&:focus-within": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "#24E88B",
  },
});

const SearchIconWrapper = styled("div", {
  width: "20px",
  height: "20px",
  color: "#FFFFFF",
  flexShrink: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.2s ease",

  "&:active": {
    opacity: 0.7,
  },
});

const SearchInput = styled("input", {
  flex: 1,
  border: "none",
  backgroundColor: "transparent",
  color: "#ffffff",
  fontSize: "18px",
  outline: "none",
  cursor: "text",

  "&::placeholder": {
    color: "rgba(255, 255, 255, 0.7)",
  },
});

const ButtonGroup = styled("div", {
  display: "flex",
  gap: "24px",
  justifyContent: "center",
  alignItems: "flex-start",
  marginBottom: "32px",
});

const ActionButton = styled("button", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
  transition: "all 0.2s ease",

  "&:active": {
    transform: "scale(0.95)",
  },
});

const IconWrapper = styled("div", {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  color: "#000000",
});

const ButtonLabel = styled("div", {
  fontSize: "12px",
  fontWeight: "400",
  color: "#EDF1F5",
  textAlign: "center",
  lineHeight: "1.3",
});

const InfoText = styled("div", {
  fontSize: "13px",
  fontWeight: "600",
  color: "#EDF1F5",
  textAlign: "center",
  lineHeight: "1.4",
  padding: "0 20px",
  marginBottom: "28px",
  whiteSpace: "pre-line",
  opacity: 0.8,
});

const AdBanner = styled("div", {
  position: "relative",
  width: "100%",
  aspectRatio: "3 / 2",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#4A6B5C",
  cursor: "pointer",
  transition: "opacity 0.2s ease",
  overflow: "hidden",
  flexShrink: 0,

  variants: {
    isNative: {
      true: {
        marginBottom: "64px",
      },
    },
  },

  "&:active": {
    opacity: 0.9,
  },
});

const AdImage = styled("img", {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
});

const AdBadge = styled("div", {
  position: "absolute",
  bottom: "24px",
  right: "16px",
  display: "flex",
  alignItems: "center",
  gap: "2px",
  padding: "4px 8px",
  borderRadius: "12px",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(10px)",
});

const AdBadgeIcon = styled("div", {
  width: "12px",
  height: "12px",
  color: "#ffffff",
});

const AdBadgeText = styled("div", {
  fontSize: "10px",
  fontWeight: "500",
  color: "#ffffff",
});

const FoodScanMainPage = () => {
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [foodCount, setFoodCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const backButtonListener = CapacitorApp.addListener(
      "backButton",
      ({ canGoBack }) => {
        if (canGoBack) {
          navigate(-1);
        } else {
          CapacitorApp.exitApp();
        }
      },
    );

    loadAdvertisement();
    loadFoodCount();

    return () => {
      backButtonListener.then((listener) => listener.remove());
    };
  }, [navigate]);

  // 숫자 카운팅 애니메이션
  useEffect(() => {
    const startCount = displayCount;
    const endCount = foodCount;

    if (startCount === endCount) return;

    const difference = endCount - startCount;
    const duration = 800; // 0.8초
    const steps = 50;
    const stepValue = difference / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayCount(endCount);
        clearInterval(timer);
      } else {
        setDisplayCount(startCount + Math.round(stepValue * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [foodCount]);

  const loadAdvertisement = async () => {
    try {
      const ad = await advertisementService.getActiveAdvertisement();
      if (ad) {
        setAdvertisement(ad);
        await advertisementService.incrementView(ad.id);
      }
    } catch (error) {
      console.error("광고 조회 실패:", error);
    }
  };

  const loadFoodCount = async () => {
    try {
      const data = await foodSearchService.getFoodCount();
      setFoodCount(data.total);
    } catch (error) {
      console.error("식품 수 조회 실패:", error);
    }
  };

  const handleAdClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!advertisement) return;

    try {
      await advertisementService.incrementClick(advertisement.id);

      if (advertisement.linkUrl) {
        console.log("Opening URL:", advertisement.linkUrl);

        // URL이 상대 경로인 경우 절대 경로로 변환
        let url = advertisement.linkUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        console.log("Final URL:", url);
        await Browser.open({ url });
      }
    } catch (error) {
      console.error("광고 클릭 처리 실패:", error);
      console.error("Error details:", error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate("/food-search", {
        state: {
          initialQuery: searchQuery.trim(),
        },
      });
    } else {
      navigate("/food-search");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCamera = () => {
    navigate("/food-scanner-camera");
  };

  const handleAlbum = () => {
    navigate("/food-scanner-camera", { state: { openAlbum: true } });
  };

  const handleHistory = () => {
    navigate("/food-history");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isNative = Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android";

  return (
    <Container>
      <CloseButton onClick={handleBack}>✕</CloseButton>

      <MainContent>
        <StatsLabel>푸드스캐너에서 분석 가능한 식품 수</StatsLabel>
        <StatsNumber>{displayCount.toLocaleString()}</StatsNumber>

        <SearchBar>
          <SearchIconWrapper onClick={handleSearch}>
            <SearchIcon />
          </SearchIconWrapper>
          <SearchInput
            placeholder="정확한 식품명을 입력해 주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </SearchBar>

        <InfoText>
          {`식약처에 등록된 식품에 한하여 분석이 제공됩니다.
띄워쓰기 여부에 따라 검색 결과가 달라질 수 있습니다.
평균 인식률 정확도 : 검색(95%) > 촬영/앨범(86%)`}
        </InfoText>

        <ButtonGroup>
          <ActionButton onClick={handleCamera}>
            <IconWrapper>
              <CameraIcon />
            </IconWrapper>
            <ButtonLabel>촬영으로 분석</ButtonLabel>
          </ActionButton>

          <ActionButton onClick={handleAlbum}>
            <IconWrapper>
              <ImageIcon />
            </IconWrapper>
            <ButtonLabel>사진으로 분석</ButtonLabel>
          </ActionButton>

          <ActionButton onClick={handleHistory}>
            <IconWrapper>
              <FileListIcon />
            </IconWrapper>
            <ButtonLabel>분석기록 찾기</ButtonLabel>
          </ActionButton>
        </ButtonGroup>
      </MainContent>

      <AdBanner onClick={handleAdClick} isNative={isNative}>
        {advertisement && advertisement.type === "IMAGE" && (
          <AdImage src={advertisement.mediaUrl} alt={advertisement.title} />
        )}
        <AdBadge>
          <AdBadgeText>AD</AdBadgeText>
        </AdBadge>
      </AdBanner>
    </Container>
  );
};

export default FoodScanMainPage;
