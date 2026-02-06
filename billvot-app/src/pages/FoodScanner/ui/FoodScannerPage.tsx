import { useEffect, useRef, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import SearchIcon from "@app/assets/search.svg?react";
import AlbumIcon from "@app/assets/album.svg?react";
import HistoryIcon from "@app/assets/history.svg?react";

import { FullscreenCamera } from "capacitor-fullscreen-camera";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

import { styled } from "../../../styles";
import {
  foodScanService,
  authService,
  foodSearchService,
} from "../../../api/rest/services";

interface ScanQuotaResponse {
  dailyQuota: number;
  monthlyQuota: number;
  dailyUsed: number;
  monthlyUsed: number;
  dailyRemaining: number;
  monthlyRemaining: number;
  nextDailyReset: string;
  nextMonthlyReset: string;
}

const Container = styled("div", {
  width: "100%",
  height: "100dvh",
  backgroundColor: "transparent",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const CameraContainer = styled("div", {
  flex: 1,
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "100%",
  backgroundColor: "transparent",
});

const CloseButton = styled("button", {
  position: "absolute",
  top: "40px",
  right: "20px",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "transparent",
  paddingTop: "calc(env(safe-area-inset-top))",
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

const ResultOverlay = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(56, 101, 79, 1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 20,
  padding: "40px 20px",
});

const ResultHeader = styled("div", {
  color: "white",
  textAlign: "center",
  marginBottom: "10px",
  paddingTop: "calc(env(safe-area-inset-top) - 20px)",
});

const ProductCount = styled("div", {
  fontSize: "16px",
  marginBottom: "4px",
});

const CalorieCount = styled("div", {
  fontSize: "28px",
  fontWeight: "bold",
  marginBottom: "15px",
});

const scanLineHeight = 382;
const ProductImageContainer = styled("div", {
  position: "relative",
  width: "100%", // 308px * 0.85 = 261.8px ≈ 262px
  height: `${scanLineHeight}px`, // 308px * 0.85 = 261.8px ≈ 262px
});

const ProductImage = styled("img", {
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const ScanLine = styled("div", {
  position: "absolute",
  left: 0,
  right: 0,
  height: "4px",
  backgroundColor: "#ffffff",
  boxShadow: "0 0 15px #ffffff, 0 0 30px #ffffff",
  zIndex: 10,
  pointerEvents: "none",
});

const ProductInfo = styled("div", {
  color: "white",
  textAlign: "center",
  marginBottom: "15px",
});

const ProductTitle = styled("div", {
  fontSize: "14px",
  fontWeight: "bold",
  marginBottom: "4px",
});

const ProductDescription = styled("div", {
  fontSize: "11px",
  opacity: 0.8,
});

const ActionButtons = styled("div", {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
  alignItems: "center",
  justifyContent: "center",
});

const ActionButton = styled("button", {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "white",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
});

const ActionLabel = styled("div", {
  color: "white",
  fontSize: "12px",
  textAlign: "center",
});

const ScanButton = styled("button", {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  backgroundColor: "transparent",
  border: "3px solid #6B7280",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  flexShrink: 0, // flex로 인한 크기 변화 방지
  boxSizing: "border-box", // border 포함해서 크기 계산

  "&:active": {
    transform: "scale(0.95)",
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.7,
  },
});

const ScanButtonInner = styled("div", {
  width: "41px", // 더 작게 조정
  height: "41px", // 더 작게 조정
  borderRadius: "50%",
  backgroundColor: "#24E88B", // 연한 초록색
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

const LoadingSpinner = styled("div", {
  width: "24px",
  height: "24px",
  border: "2px solid #ffffff",
  borderTop: "2px solid transparent",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",

  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
});

const LoadingText = styled("div", {
  position: "absolute",
  bottom: "-30px",
  left: "50%",
  transform: "translateX(-50%)",
  color: "white",
  fontSize: "14px",
  whiteSpace: "nowrap",
});

const BlurOverlay = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none",
  zIndex: 15,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const BlurSection = styled("div", {
  width: "100%",
  backgroundColor: "rgba(56, 101, 79, 1)",
  backdropFilter: "blur(15px)",
});

const OptionsButton = styled("button", {
  position: "absolute",
  bottom: "80px",
  right: "20px",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  zIndex: 101,
  transition: "all 0.2s ease",
  backdropFilter: "blur(10px)",

  "&:active": {
    transform: "scale(0.95)",
  },
});

const OptionsPanel = styled("div", {
  position: "absolute",
  bottom: "80px",
  right: "20px",
  width: "280px",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  borderRadius: "12px",
  padding: "20px",
  zIndex: 102,
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
});

const OptionsTitle = styled("div", {
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "15px",
  textAlign: "center",
});

const OptionGroup = styled("div", {
  marginBottom: "15px",
});

const OptionLabel = styled("div", {
  color: "white",
  fontSize: "14px",
  marginBottom: "8px",
  fontWeight: "500",
});

const ModelButtons = styled("div", {
  display: "flex",
  gap: "8px",
});

const ModelButton = styled("button", {
  flex: 1,
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  backgroundColor: "transparent",
  color: "white",
  cursor: "pointer",
  fontSize: "12px",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  variants: {
    active: {
      true: {
        backgroundColor: "#24E88B",
        borderColor: "#24E88B",
        color: "black",
      },
    },
  },
});

const SliderContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const Slider = styled("input", {
  flex: 1,
  height: "4px",
  borderRadius: "2px",
  background: "rgba(255, 255, 255, 0.3)",
  outline: "none",
  cursor: "pointer",

  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#24E88B",
    cursor: "pointer",
  },

  "&::-moz-range-thumb": {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#24E88B",
    cursor: "pointer",
    border: "none",
  },
});

const SliderValue = styled("div", {
  color: "white",
  fontSize: "12px",
  minWidth: "30px",
  textAlign: "center",
});

const QuotaToast = styled("div", {
  position: "absolute",
  top: "100px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  color: "white",
  padding: "12px 20px",
  borderRadius: "24px",
  fontSize: "13px",
  fontWeight: "500",
  zIndex: 102,
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  alignItems: "center",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  animation: "slideDown 0.3s ease-out",

  "@keyframes slideDown": {
    from: {
      opacity: 0,
      transform: "translateX(-50%) translateY(-10px)",
    },
    to: {
      opacity: 1,
      transform: "translateX(-50%) translateY(0)",
    },
  },
});

const ToggleContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const Toggle = styled("button", {
  width: "44px",
  height: "24px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  position: "relative",
  transition: "all 0.2s ease",

  variants: {
    active: {
      true: {
        backgroundColor: "#24E88B",
      },
      false: {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
      },
    },
  },
});

const ToggleThumb = styled("div", {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: "white",
  position: "absolute",
  top: "2px",
  transition: "all 0.2s ease",

  variants: {
    active: {
      true: {
        transform: "translateX(20px)",
      },
      false: {
        transform: "translateX(2px)",
      },
    },
  },
});

function FoodScannerPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === "web") {
      alert("푸드스캐너는 모바일 앱에서만 사용 가능합니다.");
      navigate("/main/foodscanner");
    }
  }, [navigate]);

  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<"front" | "rear">(
    "rear",
  );
  const [showResult, setShowResult] = useState(false);
  const [scannedImage, setScannedImage] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanLinePosition, setScanLinePosition] = useState(0);
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API 옵션 상태 - 항상 기본값 사용
  const [scanOptions, setScanOptions] = useState<{
    model: "gemini-flash" | "gemini-flash-lite";
    thinkingBudget: number;
    useOnlyImagePrompt: boolean;
  }>({
    model: "gemini-flash-lite",
    thinkingBudget: 500,
    useOnlyImagePrompt: false,
  });
  const [showOptions, setShowOptions] = useState(false);

  // 스캔 횟수 상태
  const [scanQuota, setScanQuota] = useState<ScanQuotaResponse | null>(null);
  const [showQuotaToast, setShowQuotaToast] = useState(false);

  // 식품 수 상태
  const [foodCount, setFoodCount] = useState(756950);
  const [displayCount, setDisplayCount] = useState(756950);

  useEffect(() => {
    // body와 #root의 배경을 투명하게 설정하여 카메라가 보이도록 함
    const body = document.body;
    const root = document.getElementById("root");
    const originalBodyBg = body.style.backgroundColor;
    const originalRootBg = root?.style.backgroundColor;

    // safe-area 관련 스타일 제거
    const originalBodyMargin = body.style.margin;
    const originalBodyMarginTop = body.style.marginTop;
    const originalBodyMarginBottom = body.style.marginBottom;
    const originalBodyHeight = body.style.height;
    const originalRootMargin = root?.style.margin;
    const originalRootMarginTop = root?.style.marginTop;
    const originalRootMarginBottom = root?.style.marginBottom;
    const originalRootHeight = root?.style.height;

    body.style.backgroundColor = "transparent";
    body.style.margin = "0";
    body.style.marginTop = "0";
    body.style.marginBottom = "0";
    body.style.height = "100dvh";

    if (root) {
      root.style.backgroundColor = "transparent";
      root.style.margin = "0";
      root.style.marginTop = "0";
      root.style.marginBottom = "0";
      root.style.height = "100dvh";
    }

    console.log("배경 투명화 및 safe-area 제거 완료");

    startCamera();

    // 스캔 횟수 조회
    loadScanQuota();

    // 식품 수 조회
    loadFoodCount();

    // 안드로이드 뒤로가기 버튼 처리
    const handleBackButton = () => {
      console.log("안드로이드 뒤로가기 버튼 클릭");
      handleClose();
      return false; // 기본 뒤로가기 동작 방지
    };

    // 화면 크기 변경 시 카메라 재시작
    const handleResize = () => {
      if (isCameraStarted) {
        stopCamera().then(() => {
          setTimeout(() => startCamera(), 100);
        });
      }
    };

    // 페이지 가시성 변경 시 카메라 제어
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("페이지 숨겨짐 - 카메라 정지");
        stopCamera();
      } else {
        console.log("페이지 표시됨 - 카메라 시작");
        setTimeout(() => startCamera(), 100);
      }
    };

    // Capacitor App 플러그인으로 하드웨어 뒤로가기 버튼 리스너 등록
    const backButtonListener = App.addListener("backButton", handleBackButton);

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      console.log("FoodScannerPage 언마운트 - 카메라 정지");

      // 배경색, 마진, height 복원
      body.style.backgroundColor = originalBodyBg;
      body.style.margin = originalBodyMargin;
      body.style.marginTop = originalBodyMarginTop;
      body.style.marginBottom = originalBodyMarginBottom;
      body.style.height = originalBodyHeight;

      if (root) {
        root.style.backgroundColor = originalRootBg || "";
        root.style.margin = originalRootMargin || "";
        root.style.marginTop = originalRootMarginTop || "";
        root.style.marginBottom = originalRootMarginBottom || "";
        root.style.height = originalRootHeight || "";
      }

      backButtonListener.then((listener) => listener.remove());
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopCamera();
    };
  }, []);

  // 앨범에서 사진 선택 자동 열기
  useEffect(() => {
    const openAlbum = location.state?.openAlbum;
    if (openAlbum && isCameraStarted) {
      // 카메라가 시작된 후 약간의 딜레이를 두고 파일 선택 열기
      const timer = setTimeout(() => {
        fileInputRef.current?.click();
        // state 초기화하여 다시 페이지에 들어왔을 때 자동으로 열리지 않도록
        window.history.replaceState({}, document.title);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isCameraStarted, location.state]);

  // 스캔 애니메이션 제어
  useEffect(() => {
    let animationId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // 2초 주기로 반복
      const cycle = (elapsed % 2000) / 2000; // 0 ~ 1

      // 사인 곡선으로 부드러운 움직임
      const position = Math.sin(cycle * Math.PI) * scanLineHeight; // 0 ~ 258px (262px - 4px)
      setScanLinePosition(position);

      if (isScanning) {
        animationId = requestAnimationFrame(animate);
      }
    };

    if (isScanning) {
      console.log("스캔 애니메이션 시작");
      animationId = requestAnimationFrame(animate);
    } else {
      console.log("스캔 애니메이션 정지");
      setScanLinePosition(0);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isScanning]);

  // Toast 자동 숨김
  useEffect(() => {
    if (showQuotaToast) {
      const timer = setTimeout(() => {
        setShowQuotaToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showQuotaToast]);

  // localStorage 저장 비활성화 - 항상 기본값 사용
  // useEffect(() => {
  //   localStorage.setItem("foodScannerOptions", JSON.stringify(scanOptions));
  // }, [scanOptions]);

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

  const loadScanQuota = async () => {
    try {
      console.log("스캔 횟수 조회 시작...");
      console.log("authService:", authService);
      console.log("getScanQuota 존재 여부:", typeof authService?.getScanQuota);

      if (!authService || typeof authService.getScanQuota !== "function") {
        console.error("authService.getScanQuota가 존재하지 않습니다");
        return;
      }

      const quota = await authService.getScanQuota();
      console.log("스캔 횟수 조회 성공:", quota);
      setScanQuota(quota);
      setShowQuotaToast(true);
    } catch (error) {
      console.error("스캔 횟수 조회 실패:", error);
      console.error("에러 상세:", error);
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

  const startCamera = async () => {
    try {
      if (isCameraStarted) {
        console.log("카메라가 이미 시작된 상태입니다");
        return;
      }

      await FullscreenCamera.start({
        position: cameraPosition,
      });
      setIsCameraStarted(true);
      console.log("카메라 시작 성공");
    } catch (error) {
      console.error("카메라 시작 실패:", error);
      setIsCameraStarted(false);
    }
  };

  const stopCamera = async () => {
    try {
      if (isCameraStarted) {
        await FullscreenCamera.stop();
        console.log("카메라 중지 성공");
      }
      setIsCameraStarted(false);
    } catch (error) {
      console.error("카메라 중지 실패:", error);
      setIsCameraStarted(false);
    }
  };

  const capturePhoto = async () => {
    try {
      // 스캔 횟수 체크
      if (scanQuota) {
        if (scanQuota.dailyRemaining <= 0 && scanQuota.monthlyRemaining <= 0) {
          alert("스캔 횟수를 모두 사용하셨습니다.");
          return;
        } else if (scanQuota.dailyRemaining <= 0) {
          alert("오늘의 일간 스캔 횟수를 모두 사용하셨습니다.");
          return;
        } else if (scanQuota.monthlyRemaining <= 0) {
          alert("이번 달의 월간 스캔 횟수를 모두 사용하셨습니다.");
          return;
        }
      }

      setIsScanning(true);

      console.log("사진 촬영 시작 - 카메라 프리뷰 영역 그대로 촬영");

      const result = await FullscreenCamera.capture({
        quality: 85,
      });

      console.log("=== 촬영된 이미지 정보 ===");
      console.log("이미지 크기:", result.width, "×", result.height);
      console.log("비율:", result.aspectRatio?.toFixed(3));
      console.log("Base64 길이:", result.value?.length);
      console.log("========================");

      const base64Image = result.value;
      const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
      setScannedImage(imageDataUrl);
      setShowResult(true);

      await stopCamera();

      try {
        const scanResponse = await foodScanService.scanFoodFromImage(
          base64Image,
          scanOptions as {
            model?: "gemini-flash" | "gemini-flash-liste";
            thinkingBudget?: number;
            useOnlyImagePrompt?: boolean;
          },
        );
        handleScanResponse(scanResponse);
      } catch (scanError) {
        console.error("스캔 실패:", scanError);
        alert("스캔 요청에 실패했습니다. 다시 촬영해주세요.");
        setIsScanning(false);
        setShowResult(false);
        setScannedImage("");

        try {
          await stopCamera();
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error("카메라 중지 실패:", error);
        }

        window.location.reload();
      }
    } catch (error) {
      console.error("사진 촬영 실패:", error);
      alert("사진 촬영에 실패했습니다. 다시 시도해주세요.");

      try {
        await stopCamera();
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (stopError) {
        console.error("카메라 중지 실패:", stopError);
      }

      window.location.reload();
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanResponse = async (response: any) => {
    // 스캔 상태 확인
    if (response.scanStatus === "FAILURE") {
      // 실패한 경우
      let errorMessage = "음식을 인식할 수 없습니다. 다시 촬영해주세요.";

      if (response.failureReason === "PRODUCT_RECOGNITION_FAILED") {
        errorMessage =
          "제품을 인식할 수 없습니다. 제품명이 잘 보이도록 다시 촬영해주세요.";
      }

      alert(errorMessage);
      // 실패 시 카메라 상태 초기화
      setIsScanning(false);
      setShowResult(false);
      setScannedImage("");

      // 카메라 완전히 중지 후 새로고침
      try {
        await stopCamera();
        // 카메라 리소스 해제를 위한 짧은 대기
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error("카메라 중지 실패:", error);
      }

      window.location.reload();
      return;
    }

    // 성공한 경우 searchResults 확인
    const results = response.searchResults;
    console.log("FoodScannerPage - response:", response);
    console.log("FoodScannerPage - searchResults:", results);

    if (!results || results.length === 0) {
      // 결과가 없는 경우
      alert("인식된 음식이 없습니다. 다시 촬영해주세요.");
      // 결과 없음 시 카메라 상태 초기화
      setIsScanning(false);
      setShowResult(false);
      setScannedImage("");

      // 카메라 완전히 중지 후 새로고침
      try {
        await stopCamera();
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error("카메라 중지 실패:", error);
      }

      window.location.reload();
    } else if (results.length === 1) {
      // 결과가 1개인 경우 바로 상세 페이지로 이동
      setIsScanning(false);
      await stopCamera();

      // 스캔 횟수 다시 조회
      loadScanQuota();

      // AI 생성된 결과인지 확인
      if (results[0].id.startsWith("ai-")) {
        // AI 생성 결과인 경우 전체 스캔 데이터를 함께 전달
        navigate(`/food-detail/${results[0].id}`, {
          state: {
            scanData: response,
            isAiGenerated: true,
          },
        });
      } else {
        // 일반 결과인 경우 ID만 전달
        navigate(`/food-detail/${results[0].id}`);
      }
    } else {
      // 결과가 여러 개인 경우 스캔 결과 페이지로 이동
      setIsScanning(false);
      await stopCamera();

      // 스캔 횟수 다시 조회
      loadScanQuota();

      navigate("/food-scan-results", {
        state: {
          scanResults: results,
          scanId: response.id, // scanId 전달
        },
      });
    }
  };

  const handleCloseResult = async () => {
    setShowResult(false);
    setScannedImage("");
    setIsScanning(false);
    // 결과 닫기 후 카메라 상태 초기화 후 재시작
    await stopCamera();
    // 잠시 대기 후 카메라 재시작
    setTimeout(() => {
      startCamera();
    }, 300);
  };

  const handleClose = async () => {
    setIsScanning(false);
    await stopCamera();
    navigate("/main/foodscanner", { replace: true });
  };

  const handleSearchClick = async () => {
    setIsScanning(false);
    await stopCamera();
    navigate("/main/foodscanner");
  };

  const handleHistoryClick = async () => {
    setIsScanning(false);
    await stopCamera();
    navigate("/food-history");
  };

  const handleAlbumClick = () => {
    // 파일 선택 다이얼로그 열기
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    // 스캔 횟수 체크
    if (scanQuota) {
      if (scanQuota.dailyRemaining <= 0 && scanQuota.monthlyRemaining <= 0) {
        alert("스캔 횟수를 모두 사용하셨습니다.");
        return;
      } else if (scanQuota.dailyRemaining <= 0) {
        alert("오늘의 일간 스캔 횟수를 모두 사용하셨습니다.");
        return;
      } else if (scanQuota.monthlyRemaining <= 0) {
        alert("이번 달의 월간 스캔 횟수를 모두 사용하셨습니다.");
        return;
      }
    }

    try {
      setIsScanning(true);

      // 파일을 base64로 변환
      const base64Image = await convertFileToBase64(file);
      setScannedImage(base64Image);
      setShowResult(true);

      // 카메라 정지
      await stopCamera();

      // base64에서 data URL 부분 제거
      const base64Data = base64Image.replace(/^data:image\/[^;]+;base64,/, "");

      // API로 이미지 스캔 요청
      try {
        const scanResponse = await foodScanService.scanFoodFromImage(
          base64Data,
          scanOptions as {
            model?: "gemini-flash" | "gemini-flash-liste";
            thinkingBudget?: number;
            useOnlyImagePrompt?: boolean;
          },
        );
        handleScanResponse(scanResponse);
      } catch (scanError) {
        console.error("스캔 실패:", scanError);
        alert("스캔 요청에 실패했습니다. 다시 시도해주세요.");
        // 스캔 실패 시 카메라 상태 초기화 후 재시작
        setIsScanning(false);
        setShowResult(false);
        setScannedImage("");
        await stopCamera();
        setTimeout(() => {
          startCamera();
        }, 500);
      }
    } catch (error) {
      console.error("파일 처리 실패:", error);
      alert("파일 처리에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsScanning(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const convertFileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log(
        "convertFileToBase64 시작, 파일:",
        file.name,
        "크기:",
        file.size,
      );

      // FullscreenCameraPlugin.java와 동일한 설정
      const maxDimension = 960;
      const quality = 0.85; // 85%

      // 타임아웃 설정 (안드로이드에서 무한 대기 방지)
      const timeout = setTimeout(() => {
        reject(
          new Error("이미지 처리 시간이 초과되었습니다. 다시 시도해주세요."),
        );
      }, 30000); // 30초 타임아웃

      // ArrayBuffer로 읽어서 Blob으로 재생성 (권한 문제 우회)
      const arrayBufferReader = new FileReader();

      arrayBufferReader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;

          if (!arrayBuffer) {
            clearTimeout(timeout);
            reject(new Error("파일을 읽을 수 없습니다."));
            return;
          }

          console.log("ArrayBuffer 읽기 완료, Blob 생성...");

          // ArrayBuffer를 Blob으로 재생성 (권한 문제 해결)
          const blob = new Blob([arrayBuffer], {
            type: file.type || "image/jpeg",
          });
          const blobUrl = URL.createObjectURL(blob);

          console.log("Blob 생성 완료, 이미지 로드 시작...");

          // 이미지 객체 생성
          const img = new Image();

          img.onload = () => {
            try {
              // Blob URL 해제
              URL.revokeObjectURL(blobUrl);

              console.log("이미지 로드 완료, 압축 시작...");
              console.log("원본 크기:", img.width, "x", img.height);

              // 원본 이미지 크기
              let width = img.width;
              let height = img.height;

              // 비율 유지하며 크기 조정
              if (width > height) {
                if (width > maxDimension) {
                  height = (height * maxDimension) / width;
                  width = maxDimension;
                }
              } else {
                if (height > maxDimension) {
                  width = (width * maxDimension) / height;
                  height = maxDimension;
                }
              }

              console.log("압축 후 크기:", width, "x", height);

              // Canvas 생성 및 이미지 그리기
              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d", { alpha: false });

              if (!ctx) {
                clearTimeout(timeout);
                reject(new Error("Canvas context를 가져올 수 없습니다."));
                return;
              }

              // 이미지 품질 개선 설정
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";

              // 배경을 흰색으로 채우기 (투명도 제거)
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(0, 0, width, height);

              // 이미지 그리기
              ctx.drawImage(img, 0, 0, width, height);

              // Canvas를 base64로 변환
              try {
                const base64 = canvas.toDataURL("image/jpeg", quality);

                clearTimeout(timeout);

                console.log("=== Processed image info ===");
                console.log("Base64 length:", base64.length);
                console.log("Original file size:", file.size);
                console.log(
                  "Compressed ratio:",
                  ((base64.length / file.size) * 100).toFixed(1) + "%",
                );
                console.log("===========================");

                resolve(base64);
              } catch (error) {
                clearTimeout(timeout);
                console.error("Canvas toDataURL 실패:", error);
                reject(new Error("이미지를 변환할 수 없습니다."));
              }
            } catch (error) {
              URL.revokeObjectURL(blobUrl);
              clearTimeout(timeout);
              console.error("이미지 처리 중 오류:", error);
              reject(new Error("이미지 처리 중 오류가 발생했습니다."));
            }
          };

          img.onerror = (error) => {
            URL.revokeObjectURL(blobUrl);
            clearTimeout(timeout);
            console.error("이미지 로드 실패:", error);
            reject(
              new Error(
                "이미지를 로드할 수 없습니다. 파일을 다시 선택해주세요.",
              ),
            );
          };

          // Blob URL을 이미지 소스로 설정
          img.src = blobUrl;
        } catch (error) {
          clearTimeout(timeout);
          console.error("Blob 생성 실패:", error);
          reject(new Error("이미지 처리를 시작할 수 없습니다."));
        }
      };

      arrayBufferReader.onerror = (error) => {
        clearTimeout(timeout);
        console.error("ArrayBuffer 읽기 실패:", error);
        reject(
          new Error("파일을 읽을 수 없습니다. 다른 이미지를 선택해주세요."),
        );
      };

      // ArrayBuffer로 파일 읽기 시작 (권한 문제에 더 강함)
      try {
        arrayBufferReader.readAsArrayBuffer(file);
      } catch (error) {
        clearTimeout(timeout);
        console.error("파일 읽기 시작 실패:", error);
        reject(new Error("파일 처리를 시작할 수 없습니다."));
      }
    });
  };

  // 옵션 핸들러 함수들
  const handleModelChange = (model: "gemini-flash" | "gemini-flash-lite") => {
    setScanOptions((prev) => ({
      ...prev,
      model,
    }));
  };

  const handleThinkingBudgetChange = (value: number) => {
    setScanOptions((prev) => ({ ...prev, thinkingBudget: value }));
  };

  const handleUseOnlyImagePromptToggle = () => {
    setScanOptions((prev) => ({
      ...prev,
      useOnlyImagePrompt: !prev.useOnlyImagePrompt,
    }));
  };

  const toggleOptionsPanel = () => {
    setShowOptions((prev) => !prev);
  };

  // 옵션 패널 외부 클릭 시 닫기
  const handleOptionsPanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleBackgroundClick = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  return (
    <Container>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <CameraContainer ref={cameraContainerRef} onClick={handleBackgroundClick}>
        <CloseButton onClick={handleClose}>✕</CloseButton>

        {/* 항상 보이는 블러 오버레이 */}
        <BlurOverlay>
          <BlurSection style={{ flex: 1 }} />
          {showResult ? (
            <ProductImageContainer>
              <ProductImage src={scannedImage} alt="스캔된 음식" />
              {isScanning && scanLinePosition > 0 && (
                <ScanLine
                  style={{
                    top: `${scanLinePosition}px`,
                    opacity:
                      0.8 + 0.2 * Math.sin((scanLinePosition / 258) * Math.PI),
                  }}
                />
              )}
            </ProductImageContainer>
          ) : (
            <div style={{ width: "100%", height: scanLineHeight - 14 }} />
          )}
          <BlurSection style={{ flex: 2 }} />
        </BlurOverlay>

        {/* 항상 보이는 UI 오버레이 */}
        <ResultOverlay
          style={{
            backgroundColor: "transparent",
          }}
        >
          <ResultHeader>
            <ProductCount>푸드스캐너에서 분석 가능한 식품 수</ProductCount>
            <CalorieCount>{displayCount.toLocaleString()}</CalorieCount>
          </ResultHeader>

          <div style={{ width: "100%", height: scanLineHeight }} />

          <ProductInfo style={{ marginTop: "68x" }}>
            <ProductTitle>로고나 제품명 텍스트가</ProductTitle>
            <ProductTitle>정면을 바라보도록 촬영해 주세요</ProductTitle>
            <ProductDescription>
              빛반사, 찌그러짐 형태는 인식에 제한이 발생할 수 있습니다. <br />
              인식이 되지 않을 경우 검색으로 분석하기를 시도해 주세요.
            </ProductDescription>
          </ProductInfo>

          <ActionButtons>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ActionButton onClick={handleSearchClick}>
                <SearchIcon
                  width={20}
                  height={20}
                  style={{ fill: "#000000" }}
                />
              </ActionButton>
              <ActionLabel>검색으로 분석</ActionLabel>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ActionButton onClick={handleAlbumClick}>
                <AlbumIcon width={20} height={20} style={{ fill: "#000000" }} />
              </ActionButton>
              <ActionLabel>앨범에서 분석</ActionLabel>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ActionButton onClick={handleHistoryClick}>
                <HistoryIcon
                  width={20}
                  height={20}
                  style={{ fill: "#000000" }}
                />
              </ActionButton>
              <ActionLabel>분석기록 찾기</ActionLabel>
            </div>
          </ActionButtons>

          {showResult ? (
            <ScanButton onClick={handleCloseResult}>
              <ScanButtonInner />
            </ScanButton>
          ) : (
            <ScanButton onClick={capturePhoto} disabled={isScanning}>
              <ScanButtonInner>
                {isScanning && (
                  <>
                    <LoadingSpinner />
                    <LoadingText>분석 중...</LoadingText>
                  </>
                )}
              </ScanButtonInner>
            </ScanButton>
          )}
        </ResultOverlay>

        {showQuotaToast && scanQuota && (
          <QuotaToast>
            <div>오늘 남은 횟수: {scanQuota.dailyRemaining}회</div>
            <div>이달 남은 횟수: {scanQuota.monthlyRemaining}회</div>
          </QuotaToast>
        )}

        {/* 옵션 설정 버튼 - 숨김 처리 */}
        {/* <OptionsButton onClick={toggleOptionsPanel}>⚙️</OptionsButton> */}

        {/* 옵션 패널 - 숨김 처리 */}
        {/* {showOptions && (
          <OptionsPanel onClick={handleOptionsPanelClick}>
            <OptionsTitle>스캔 옵션</OptionsTitle>

            <OptionGroup>
              <OptionLabel>AI 모델</OptionLabel>
              <ModelButtons>
                <ModelButton
                  active={scanOptions.model === "gemini-flash"}
                  onClick={() => handleModelChange("gemini-flash")}
                >
                  Gemini 2.5 Flash
                </ModelButton>
                <ModelButton
                  active={scanOptions.model === "gemini-flash-lite"}
                  onClick={() => handleModelChange("gemini-flash-lite")}
                >
                  Gemini 2.5 Flash Lite
                </ModelButton>
              </ModelButtons>
            </OptionGroup>

            <OptionGroup>
              <OptionLabel>
                Thinking Budget: {scanOptions.thinkingBudget}
              </OptionLabel>
              <SliderContainer>
                <Slider
                  type="range"
                  min="0"
                  max="8000"
                  step="100"
                  value={scanOptions.thinkingBudget}
                  onChange={(e) =>
                    handleThinkingBudgetChange(Number(e.target.value))
                  }
                />
                <SliderValue>{scanOptions.thinkingBudget}</SliderValue>
              </SliderContainer>
            </OptionGroup>

            <OptionGroup>
              <ToggleContainer>
                <OptionLabel>이미지 분석 우선 사용</OptionLabel>
                <Toggle
                  active={scanOptions.useOnlyImagePrompt}
                  onClick={handleUseOnlyImagePromptToggle}
                >
                  <ToggleThumb active={scanOptions.useOnlyImagePrompt} />
                </Toggle>
              </ToggleContainer>
            </OptionGroup>
          </OptionsPanel>
        )} */}
      </CameraContainer>
    </Container>
  );
}

export default FoodScannerPage;
