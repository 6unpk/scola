import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { fetchMarkers, type PlaceMarker } from './api';

export type NearbyPlace = PlaceMarker & { distanceKm: number };

type Status = 'unknown' | 'denied' | 'locating' | 'ready' | 'error';

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

export function useNearby(limit = 8) {
  const [status, setStatus] = useState<Status>('unknown');
  const [label, setLabel] = useState('');
  const [places, setPlaces] = useState<NearbyPlace[]>([]);

  const locate = useCallback(async () => {
    setStatus('locating');
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = pos.coords;
      const [markers, geo] = await Promise.all([
        fetchMarkers(),
        Location.reverseGeocodeAsync({ latitude, longitude }).catch(() => []),
      ]);
      const g = geo[0];
      if (g) setLabel([g.subregion ?? g.city ?? g.region, g.district].filter(Boolean).join(' '));
      const ranked = markers
        .map((m) => ({ ...m, distanceKm: distanceKm(latitude, longitude, m.latitude, m.longitude) }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, limit);
      setPlaces(ranked);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [limit]);

  const request = useCallback(async () => {
    const { status: s } = await Location.requestForegroundPermissionsAsync();
    if (s === 'granted') locate();
    else setStatus('denied');
  }, [locate]);

  useEffect(() => {
    Location.getForegroundPermissionsAsync().then(({ status: s }) => {
      if (s === 'granted') locate();
      else setStatus('denied');
    });
  }, [locate]);

  return { status, label, places, request, refresh: locate };
}
