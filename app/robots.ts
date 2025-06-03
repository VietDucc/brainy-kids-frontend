import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brainykidslearn.id.vn';
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/vi/*',
        '/en/*',
      ],
      disallow: [
        '/api/*',
        '/admin/*',
        '*/private/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 