import { SITE, postSlugs, urlset } from '@/lib/sitemap';

export const revalidate = 86400;

export async function GET() {
  const slugs = await postSlugs();
  return urlset([
    SITE,
    `${SITE}/posts`,
    ...slugs.map((s) => `${SITE}/posts/${s}`),
    `${SITE}/guide`,
    `${SITE}/guide/finland`,
    `${SITE}/guide/japan`,
    `${SITE}/about`,
  ]);
}
