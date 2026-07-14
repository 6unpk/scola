'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import type { PlaceMarker } from '@/types/place';

const BRAND = '#A62121';

// 개별 장소 마커 아이콘 (브랜드 레드 도트)
function markerIcon(naver: any) {
  return {
    content:
      `<div style="width:14px;height:14px;border-radius:50%;background:${BRAND};` +
      `border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4);cursor:pointer;"></div>`,
    anchor: new naver.maps.Point(7, 7),
  };
}

// 클러스터 아이콘 (크기 티어별 원)
function clusterIcon(naver: any, size: number) {
  return {
    content:
      `<div style="width:${size}px;height:${size}px;line-height:${size}px;` +
      `background:${BRAND};color:#fff;border-radius:50%;text-align:center;` +
      `font-weight:800;font-size:13px;border:2px solid #fff;` +
      `box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    size: new naver.maps.Size(size, size),
    anchor: new naver.maps.Point(size / 2, size / 2),
  };
}

function infoHtml(p: PlaceMarker) {
  const thumb = p.thumbnail ?? '/place-placeholder.svg';
  const addr = p.road_address ?? '';
  return (
    `<div style="width:220px;padding:12px;font-family:inherit;">` +
      `<div style="display:flex;gap:10px;">` +
        `<img src="${thumb}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:8px;flex-shrink:0;" ` +
          `onerror="this.src='/place-placeholder.svg'"/>` +
        `<div style="min-width:0;">` +
          `<div style="font-weight:800;font-size:14px;color:#1a1a1a;line-height:1.3;margin-bottom:4px;">${p.name}</div>` +
          (addr ? `<div style="font-size:11px;color:#888;line-height:1.4;overflow:hidden;">${addr}</div>` : '') +
        `</div>` +
      `</div>` +
      `<a href="/place/${p.id}" style="display:block;margin-top:10px;text-align:center;` +
        `background:${BRAND};color:#fff;font-size:12px;font-weight:700;padding:8px 0;` +
        `border-radius:8px;text-decoration:none;">상세보기</a>` +
    `</div>`
  );
}

interface Props {
  places: PlaceMarker[];
  ready: boolean;
}

export default function PlacesMap({ places, ready }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const clusterRef = useRef<any>(null);
  const infoRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 지도 1회 초기화
  useEffect(() => {
    if (!ready || !elRef.current || mapRef.current) return;
    const naver = (window as any).naver;
    mapRef.current = new naver.maps.Map(elRef.current, {
      center: new naver.maps.LatLng(36.5, 127.8),
      zoom: 7,
      minZoom: 6,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: { position: naver.maps.Position.BOTTOM_LEFT },
    });
    infoRef.current = new naver.maps.InfoWindow({
      content: '',
      borderWidth: 0,
      backgroundColor: '#fff',
      anchorSize: new naver.maps.Size(12, 12),
      pixelOffset: new naver.maps.Point(0, -6),
    });
  }, [ready]);

  // 마커/클러스터 (places 변경 시 재구성)
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const naver = (window as any).naver;
    const MarkerClustering = (window as any).MarkerClustering;
    const map = mapRef.current;

    // 기존 정리
    if (clusterRef.current) { clusterRef.current.setMap(null); clusterRef.current = null; }
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const markers = places.map((p) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(p.latitude, p.longitude),
        title: p.name,
        icon: markerIcon(naver),
      });
      naver.maps.Event.addListener(marker, 'click', () => {
        infoRef.current.setContent(infoHtml(p));
        infoRef.current.open(map, marker);
      });
      return marker;
    });
    markersRef.current = markers;

    clusterRef.current = new MarkerClustering({
      minClusterSize: 2,
      maxZoom: 12,
      map,
      markers,
      disableClickZoom: false,
      gridSize: 120,
      icons: [
        clusterIcon(naver, 34),
        clusterIcon(naver, 42),
        clusterIcon(naver, 52),
        clusterIcon(naver, 62),
      ],
      indexGenerator: [10, 50, 150, 500],
      stylingFunction: (clusterMarker: any, count: number) => {
        const node = clusterMarker.getElement()?.querySelector('div');
        if (node) node.textContent = String(count);
      },
    });

    return () => {
      if (infoRef.current) infoRef.current.close();
    };
  }, [ready, places]);

  return <div ref={elRef} style={{ width: '100%', height: '100%' }} />;
}
