'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { LocateFixed } from 'lucide-react';
import type { PlaceMarker } from '@/types/place';
import { sharePlace } from '@/lib/share';

const BRAND = '#A62121';
const LABEL_MIN_ZOOM = 15;

export const CATEGORY_META: { value: string; label: string; color: string }[] = [
  { value: 'sauna', label: '사우나', color: BRAND },
  { value: 'jjimjilbang', label: '찜질방', color: '#E07B1F' },
  { value: 'bath', label: '목욕탕', color: '#1F7A8C' },
  { value: 'spa', label: '스파', color: '#3B5BDB' },
  { value: 'seshin', label: '세신샵', color: '#7B3FA0' },
  { value: 'hotel', label: '호텔', color: '#5C5C5C' },
  { value: 'waterpark', label: '워터파크', color: '#0E9F6E' },
];

const COLOR_BY_CATEGORY = Object.fromEntries(CATEGORY_META.map((c) => [c.value, c.color]));

export function categoryColor(cats: string[] | null | undefined) {
  const hit = cats?.find((c) => COLOR_BY_CATEGORY[c]);
  return hit ? COLOR_BY_CATEGORY[hit] : BRAND;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function markerIcon(naver: any, p: PlaceMarker) {
  const color = categoryColor(p.app_category);
  return {
    content:
      `<div class="scola-pin">` +
        `<span class="scola-dot" style="background:${color};"></span>` +
        `<span class="scola-label">${escapeHtml(p.name)}</span>` +
      `</div>`,
    anchor: new naver.maps.Point(7, 7),
  };
}

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
  const cat = CATEGORY_META.find((c) => p.app_category?.includes(c.value));
  return (
    `<div style="width:220px;padding:12px;font-family:inherit;">` +
      `<div style="display:flex;gap:10px;">` +
        `<img src="${thumb}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:8px;flex-shrink:0;" ` +
          `onerror="this.src='/place-placeholder.svg'"/>` +
        `<div style="min-width:0;">` +
          (cat ? `<div style="font-size:11px;font-weight:700;color:${cat.color};margin-bottom:2px;">${cat.label}</div>` : '') +
          `<div style="font-weight:800;font-size:14px;color:#1a1a1a;line-height:1.3;margin-bottom:4px;">${escapeHtml(p.name)}</div>` +
          (addr ? `<div style="font-size:11px;color:#888;line-height:1.4;overflow:hidden;">${escapeHtml(addr)}</div>` : '') +
        `</div>` +
      `</div>` +
      `<div style="display:flex;gap:6px;margin-top:10px;">` +
        `<a href="/place/${p.id}" style="flex:1;text-align:center;` +
          `background:${BRAND};color:#fff;font-size:12px;font-weight:700;padding:8px 0;` +
          `border-radius:8px;text-decoration:none;">상세보기</a>` +
        `<button type="button" onclick="window.__scolaShare&&window.__scolaShare(${p.id})" ` +
          `style="flex:0 0 auto;background:#fff;border:1.5px solid #ddd;color:#333;font-size:12px;` +
          `font-weight:700;padding:8px 12px;border-radius:8px;cursor:pointer;">공유</button>` +
      `</div>` +
    `</div>`
  );
}

const MapCanvas = styled.div`
  width: 100%;
  height: 100%;

  .scola-pin {
    position: relative;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  .scola-dot {
    display: block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
  }
  .scola-label {
    display: none;
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    max-width: 140px;
    padding: 3px 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
    font-size: 12px;
    font-weight: 700;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
  }
  &.show-labels .scola-label {
    display: block;
  }
`;

const Legend = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  max-width: calc(100% - 20px);
  padding: 7px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray700};
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 250px;
    bottom: 32px;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  i {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border: 1.5px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12);
  }
`;

const LocateBtn = styled.button<{ $active: boolean }>`
  position: absolute;
  right: 10px;
  top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.gray200)};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.gray700)};
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
`;

function myLocationIcon(naver: any) {
  return {
    content:
      `<div style="width:18px;height:18px;border-radius:50%;background:#2F80ED;` +
      `border:3px solid #fff;box-shadow:0 0 0 6px rgba(47,128,237,0.25);"></div>`,
    anchor: new naver.maps.Point(9, 9),
  };
}

type LocateState = 'idle' | 'locating' | 'done' | 'error';
const LOCATE_LABEL: Record<LocateState, string> = {
  idle: '내 위치',
  locating: '위치 찾는 중',
  done: '내 위치',
  error: '위치를 가져올 수 없어요',
};

const VISIBLE_LIMIT = 10;

function rankVisible(places: PlaceMarker[], bounds: any): PlaceMarker[] {
  const sw = bounds.getSW();
  const ne = bounds.getNE();
  return places
    .filter((p) => p.latitude >= sw.lat() && p.latitude <= ne.lat() && p.longitude >= sw.lng() && p.longitude <= ne.lng())
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.review_count ?? 0) - (a.review_count ?? 0))
    .slice(0, VISIBLE_LIMIT);
}

interface Props {
  places: PlaceMarker[];
  ready: boolean;
  focus?: { place: PlaceMarker; seq: number } | null;
  onVisibleChange?: (visible: PlaceMarker[]) => void;
}

export default function PlacesMap({ places, ready, focus, onVisibleChange }: Props) {
  const placesRef = useRef(places);
  const onVisibleRef = useRef(onVisibleChange);
  placesRef.current = places;
  onVisibleRef.current = onVisibleChange;
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const clusterRef = useRef<any>(null);
  const infoRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const markerByIdRef = useRef<Map<number, any>>(new Map());
  const myMarkerRef = useRef<any>(null);
  const [locate, setLocate] = useState<LocateState>('idle');

  const goToMyLocation = () => {
    if (!mapRef.current || !navigator.geolocation) { setLocate('error'); return; }
    setLocate('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const naver = (window as any).naver;
        const map = mapRef.current;
        const here = new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        if (!myMarkerRef.current) {
          myMarkerRef.current = new naver.maps.Marker({ position: here, map, icon: myLocationIcon(naver), zIndex: 1000 });
        } else {
          myMarkerRef.current.setPosition(here);
        }
        map.morph(here, 14);
        setLocate('done');
      },
      () => {
        setLocate('error');
        setTimeout(() => setLocate('idle'), 2500);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    (window as any).__scolaShare = (id: number) => {
      const p = places.find((x) => String(x.id) === String(id));
      sharePlace(id, p?.name ?? '');
    };
    return () => { delete (window as any).__scolaShare; };
  }, [places]);

  // 지도 1회 초기화
  useEffect(() => {
    if (!ready || !elRef.current || mapRef.current) return;
    const naver = (window as any).naver;
    const el = elRef.current;
    const map = new naver.maps.Map(el, {
      center: new naver.maps.LatLng(36.5, 127.8),
      zoom: 7,
      minZoom: 6,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: { position: naver.maps.Position.BOTTOM_LEFT },
    });
    mapRef.current = map;
    infoRef.current = new naver.maps.InfoWindow({
      content: '',
      borderWidth: 0,
      backgroundColor: '#fff',
      anchorSize: new naver.maps.Size(12, 12),
      pixelOffset: new naver.maps.Point(0, -6),
    });
    const syncLabels = () => el.classList.toggle('show-labels', map.getZoom() >= LABEL_MIN_ZOOM);
    naver.maps.Event.addListener(map, 'zoom_changed', syncLabels);
    syncLabels();
    naver.maps.Event.addListener(map, 'idle', () => {
      onVisibleRef.current?.(rankVisible(placesRef.current, map.getBounds()));
    });
    navigator.permissions?.query({ name: 'geolocation' })
      .then((status) => { if (status.state === 'granted') goToMyLocation(); })
      .catch(() => {});
  }, [ready]);

  useEffect(() => {
    if (!focus || !ready || !mapRef.current) return;
    const naver = (window as any).naver;
    const map = mapRef.current;
    const at = new naver.maps.LatLng(focus.place.latitude, focus.place.longitude);
    const openInfo = () => {
      infoRef.current.setContent(infoHtml(focus.place));
      infoRef.current.open(map, markerByIdRef.current.get(focus.place.id) ?? at);
    };
    naver.maps.Event.once(map, 'idle', openInfo);
    map.morph(at, 16);
    openInfo();
  }, [focus, ready]);

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
        icon: markerIcon(naver, p),
      });
      const openInfo = () => {
        infoRef.current.setContent(infoHtml(p));
        infoRef.current.open(map, marker);
      };
      naver.maps.Event.addListener(marker, 'click', openInfo);
      naver.maps.Event.addListener(marker, 'mouseover', openInfo);
      return marker;
    });
    markersRef.current = markers;
    markerByIdRef.current = new Map(places.map((p, i) => [p.id, markers[i]]));
    onVisibleRef.current?.(rankVisible(places, map.getBounds()));

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

  return (
    <>
      <MapCanvas ref={elRef} />
      <LocateBtn type="button" $active={locate === 'done'} onClick={goToMyLocation} disabled={locate === 'locating'}>
        <LocateFixed size={15} />
        {LOCATE_LABEL[locate]}
      </LocateBtn>
      <Legend aria-hidden="true">
        {CATEGORY_META.map((c) => (
          <span key={c.value}><i style={{ background: c.color }} />{c.label}</span>
        ))}
      </Legend>
    </>
  );
}
