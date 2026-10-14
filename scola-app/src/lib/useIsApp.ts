import { useEffect, useState } from 'react';

export function useIsApp() {
  const [isApp, setIsApp] = useState(false);
  useEffect(() => {
    setIsApp(/ScolaApp/.test(navigator.userAgent));
  }, []);
  return isApp;
}
