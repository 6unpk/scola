import { romanize } from 'es-hangul';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.scola.kr';

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
