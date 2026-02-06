import { useEffect, useState } from "react";
import { SafeArea } from "capacitor-plugin-safe-area";

interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const useSafeArea = () => {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSafeArea = async () => {
      try {
        // SafeArea 정보 가져오기
        const safeAreaData = await SafeArea.getSafeAreaInsets();
        const { insets: safeInsets } = safeAreaData;
        
        // 상태바 높이 가져오기
        const statusBarData = await SafeArea.getStatusBarHeight();
        const { statusBarHeight: height } = statusBarData;

        setInsets(safeInsets);
        setStatusBarHeight(height);

        // CSS 변수로 설정
        for (const [key, value] of Object.entries(safeInsets)) {
          document.documentElement.style.setProperty(
            `--safe-area-inset-${key}`,
            `${value}px`,
          );
        }

        // 상태바 높이도 CSS 변수로 설정
        document.documentElement.style.setProperty(
          `--status-bar-height`,
          `${height}px`,
        );

        console.log("SafeArea insets:", safeInsets);
        console.log("StatusBar height:", height);
      } catch (error) {
        console.error("SafeArea 초기화 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSafeArea();

    // SafeArea 변경 리스너 등록
    let safeAreaListener: any = null;
    
    const addListener = async () => {
      try {
        safeAreaListener = await SafeArea.addListener('safeAreaChanged', (data) => {
          const { insets: newInsets } = data;
          setInsets(newInsets);

          // CSS 변수 업데이트
          for (const [key, value] of Object.entries(newInsets)) {
            document.documentElement.style.setProperty(
              `--safe-area-inset-${key}`,
              `${value}px`,
            );
          }

          console.log("SafeArea 변경됨:", newInsets);
        });
      } catch (error) {
        console.error("SafeArea 리스너 등록 오류:", error);
      }
    };

    addListener();

    // 클린업 - 특정 리스너만 제거
    return () => {
      if (safeAreaListener) {
        safeAreaListener.remove().catch(console.error);
      }
    };
  }, []);

  return {
    insets,
    statusBarHeight,
    isLoading,
  };
};
