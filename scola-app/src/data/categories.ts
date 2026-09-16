export const CATEGORY_LABEL: Record<string, string> = {
  sauna: '사우나',
  bath: '목욕탕',
  jjimjilbang: '찜질방',
  spa: '스파',
  seshin: '세신샵',
  hotel: '호텔',
  waterpark: '워터파크',
};

export const categoryLabel = (c: string): string => CATEGORY_LABEL[c] ?? c;
