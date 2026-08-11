import { MetadataRoute } from 'next';
import { getAllSlugs, getAllCategorySlugs } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();
  const baseUrl = 'https://www.pucnotes-solutions.com';

  // Use a stable date to avoid telling crawlers "everything just changed" on
  // every sitemap fetch, which causes aggressive re-crawling.
  const lastUpdated = new Date(process.env.BUILD_DATE || '2026-08-11');

  const sitemapEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: lastUpdated,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Add resource category pages (subject/category)
  const categorySlugs = getAllCategorySlugs();
  for (const [subjectSlug, categorySlug] of categorySlugs) {
    sitemapEntries.push({
      url: `${baseUrl}/${subjectSlug}/${categorySlug}`,
      lastModified: lastUpdated,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Homepage
  sitemapEntries.unshift({
    url: baseUrl,
    lastModified: lastUpdated,
    changeFrequency: 'daily',
    priority: 1.0,
  });

  return sitemapEntries;
}
