import { SITE, xml } from '@/lib/sitemap';

export const revalidate = 86400;

export function GET() {
  const maps = ['sitemap-content.xml', 'sitemap-regions.xml', 'sitemap-places.xml'];
  const items = maps.map((m) => `  <sitemap><loc>${SITE}/${m}</loc></sitemap>`).join('\n');
  return xml(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>`);
}
