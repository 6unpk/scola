import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function usePreviousLocation() {
  const { pathname } = useLocation();
  const prevPathRef = useRef<string>("");

  useEffect(() => {
    // 경로가 변경될 때마다 이전 경로 저장
    const currentPath = prevPathRef.current;
    prevPathRef.current = pathname;
    return () => {
      // 컴포넌트가 언마운트될 때 이전 경로 복원
      prevPathRef.current = currentPath;
    };
  }, [pathname]);

  return prevPathRef.current;
}
