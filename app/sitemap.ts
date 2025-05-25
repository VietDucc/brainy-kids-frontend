import { MetadataRoute } from 'next'
import { siteConfig } from './metadata'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Các route tĩnh
  const routes = [
    '',
    '/blog',
    '/courses',
    '/games',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // Thêm các route động từ database nếu cần
  // Ví dụ: các bài blog, khóa học, etc.
  
  return [...routes]
} 