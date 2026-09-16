import { romanize } from 'es-hangul';
import { regionBySlug } from '@/data/regions';
import type { Place } from '@/types/place';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

const CORE_SAUNA_CATS = ['sauna', 'jjimjilbang', 'bath', 'spa', 'seshin'];

export function excludeWaterparks(places: Place[]): Place[] {
  return places.filter((p) => {
    const cats = p.app_category ?? [];
    if (!cats.includes('waterpark')) return true;
    return cats.some((c) => CORE_SAUNA_CATS.includes(c));
  });
}

const FULL_NAME_TO_SLUG: Record<string, string> = {
  '서울특별시': 'seoul', '부산광역시': 'busan', '인천광역시': 'incheon', '대구광역시': 'daegu',
  '광주광역시': 'gwangju', '대전광역시': 'daejeon', '울산광역시': 'ulsan', '세종특별자치시': 'sejong',
  '경기도': 'gyeonggi', '강원특별자치도': 'gangwon', '충청북도': 'chungbuk', '충청남도': 'chungnam',
  '전북특별자치도': 'jeonbuk', '전라남도': 'jeonnam', '경상북도': 'gyeongbuk', '경상남도': 'gyeongnam',
  '제주특별자치도': 'jeju',
};

export interface PlaceRegionLinks {
  region: { slug: string; name: string };
  sigungu: { slug: string; label: string } | null;
}

export const MIN_SUBREGION_PLACES = 5;

export interface SubregionRow {
  value: string;
  region: string;
  label: string;
  count: number;
}

export function sigunguSlug(label: string): string {
  return romanize(label).toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function fetchSubregions(regionName: string): Promise<SubregionRow[]> {
  try {
    const res = await fetch(
      `${API_BASE}/places/subregions?region=${encodeURIComponent(regionName)}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    return (await res.json()).data ?? [];
  } catch {
    return [];
  }
}

export async function resolvePlaceLinks(address: string | null): Promise<PlaceRegionLinks | null> {
  const tokens = (address || '').trim().split(/\s+/);
  const slug = FULL_NAME_TO_SLUG[tokens[0]];
  if (!slug) return null;

  const region = { slug, name: regionBySlug(slug)?.name ?? tokens[0] };
  let sigungu: PlaceRegionLinks['sigungu'] = null;

  if (tokens[1]) {
    const subs = await fetchSubregions(region.name);
    const prefix2 = `${tokens[0]} ${tokens[1]}`;
    const match = subs.find((s) => s.value === prefix2 && s.count >= MIN_SUBREGION_PLACES);
    if (match) sigungu = { slug: sigunguSlug(match.label), label: match.label };
  }
  return { region, sigungu };
}
