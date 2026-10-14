import { API_BASE } from './config';

export interface Place {
  id: number;
  name: string;
  thumbnail: string | null;
  road_address: string | null;
  address: string | null;
  app_category: string[];
  is_24hours: boolean | null;
}

export interface PlaceMarker {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  app_category: string[];
  thumbnail: string | null;
  road_address: string | null;
  rating?: number | null;
  review_count?: number | null;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  published_at: string;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

export async function fetchDailyPlaces(): Promise<Place[]> {
  const res = await getJson<{ data: Place[] }>('/places?sort=daily&per=12&has_image=true');
  return res.data;
}

export async function fetchRecentPosts(): Promise<Post[]> {
  const res = await getJson<{ data: Post[] }>('/posts?per=4&page=1');
  return res.data;
}

let markersCache: PlaceMarker[] | null = null;

export async function fetchMarkers(): Promise<PlaceMarker[]> {
  if (markersCache) return markersCache;
  const res = await getJson<{ data: PlaceMarker[] }>('/places/markers');
  markersCache = res.data;
  return markersCache;
}
