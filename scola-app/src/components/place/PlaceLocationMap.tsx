'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNaverMaps } from '@/components/map/useNaverMaps';

type NaverNS = {
  maps: {
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown;
    Marker: new (opts: Record<string, unknown>) => unknown;
    Position: Record<string, unknown>;
  };
};

const MapBox = styled.div`
  width: 100%;
  height: 260px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  border: 1.5px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ theme }) => theme.colors.gray100};
`;

export default function PlaceLocationMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const { ready } = useNaverMaps();
  const elRef = useRef<HTMLDivElement>(null);
  const inited = useRef(false);

  useEffect(() => {
    if (!ready || !elRef.current || inited.current) return;
    const naver = (window as unknown as { naver: NaverNS }).naver;
    const pos = new naver.maps.LatLng(lat, lng);
    const map = new naver.maps.Map(elRef.current, {
      center: pos,
      zoom: 16,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: { position: naver.maps.Position.BOTTOM_LEFT },
      zoomControl: true,
      zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
    });
    new naver.maps.Marker({ position: pos, map, title: name });
    inited.current = true;
  }, [ready, lat, lng, name]);

  return <MapBox ref={elRef} />;
}
