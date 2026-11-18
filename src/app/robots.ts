import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.quinchotabolango.cl'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/reservar', '/mi-reserva'],
        disallow: ['/admin', '/api/v1/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
