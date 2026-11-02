import { regionUrls, urlset } from '@/lib/sitemap';

export const revalidate = 86400;

export async function GET() {
  return urlset(await regionUrls());
}
