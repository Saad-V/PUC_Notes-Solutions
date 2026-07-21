import { MetadataRoute } from 'next';
import { getAllSlugs, getAllCategorySlugs } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();
  const baseUrl = 'https://www.pucnotes-solutions.com';

  const sitemapEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Add resource category pages (subject/category)
  const categorySlugs = getAllCategorySlugs();
  for (const [subjectSlug, categorySlug] of categorySlugs) {
    sitemapEntries.push({
      url: `${baseUrl}/${subjectSlug}/${categorySlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Homepage
  sitemapEntries.unshift({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  return sitemapEntries;
}
