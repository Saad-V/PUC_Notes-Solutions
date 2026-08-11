import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Block aggressive AI crawlers and SEO scrapers
      {
        userAgent: [
          'GPTBot', 'CCBot', 'Google-Extended', 'Bytespider',
          'ClaudeBot', 'anthropic-ai', 'Applebot-Extended',
          'MJ12bot', 'AhrefsBot', 'SemrushBot', 'DotBot',
          'BLEXBot', 'PetalBot', 'DataForSeoBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://www.pucnotes-solutions.com/sitemap.xml',
  };
}
