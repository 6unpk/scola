'use client';

import { useEffect, useState } from 'react';

// 네이버 지도 SDK + MarkerClustering 헬퍼를 순서대로 로드하는 훅.
// SDK가 먼저 로드된 뒤 MarkerClustering(전역)이 로드돼야 하므로 동적 주입으로 순서를 보장한다.

const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const SDK_SRC = CLIENT_ID
  ? `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${CLIENT_ID}`
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
    if (!CLIENT_ID) { setStatus('error'); return; }

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
    hasKey: !!CLIENT_ID,
  };
}
