import type { Place } from '@/types/place';

const CORE_CATS = ['sauna', 'jjimjilbang', 'bath'];
const LEISURE_CATS = ['waterpark', 'hotel'];
const LEISURE_NAME = /스포츠|피트니스|휘트니스|워터파크|리조트|호텔|골프/;
const DEFAULT_OG = 'https://scola.kr/og-image.png';

function isCore(p: Place) {
  const cats = p.app_category ?? [];
  if (cats.some((c) => LEISURE_CATS.includes(c)) || LEISURE_NAME.test(p.name) || p.has_gym) return false;
  return cats.some((c) => CORE_CATS.includes(c));
}

function corePlacesFirst(places: Place[]) {
  return [...places.filter(isCore), ...places.filter((p) => !isCore(p))];
}

export function topPlaceNames(places: Place[], n = 3) {
  return corePlacesFirst(places).slice(0, n).map((p) => p.name.trim());
}

export function pickOgImage(places: Place[]) {
  return corePlacesFirst(places).find((p) => p.thumbnail)?.thumbnail ?? DEFAULT_OG;
}

export function seoTitle(base: string, count: number, names: string[]) {
  if (count === 0 || names.length === 0) return base;
  return `${base} ${count.toLocaleString()}곳 (${names.join('·')})`;
}
