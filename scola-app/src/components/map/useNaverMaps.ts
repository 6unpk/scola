'use client';

import { useEffect, useState } from 'react';

const KEY_ID = process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID;
const SDK_SRC = KEY_ID
  ? `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${KEY_ID}`
  : '';
const CLUSTER_SRC = '/vendor/marker-clustering.js';

type Status = 'idle' | 'loading' | 'ready' | 'error';

// 스크립트 하나를 로드(이미 있으면 재사용)하는 헬퍼
function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`load failed: ${src}`)));
      return;
    }
    const el = document.createElement('script');
    el.id = id;
    el.src = src;
    el.async = true;
    el.addEventListener('load', () => { el.dataset.loaded = 'true'; resolve(); });
    el.addEventListener('error', () => reject(new Error(`load failed: ${src}`)));
    document.head.appendChild(el);
  });
}

export function useNaverMaps() {
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (!KEY_ID) { setStatus('error'); return; }

    const w = window as unknown as { naver?: { maps?: unknown }; MarkerClustering?: unknown };
    if (w.naver?.maps && w.MarkerClustering) { setStatus('ready'); return; }

    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        await loadScript(SDK_SRC, 'naver-maps-sdk');
        await loadScript(CLUSTER_SRC, 'naver-marker-clustering');
        if (!cancelled) setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return {
    ready: status === 'ready',
    error: status === 'error',
    loading: status === 'loading' || status === 'idle',
    hasKey: !!KEY_ID,
  };
}
