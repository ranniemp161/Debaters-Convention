import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/writer/'],
        },
        sitemap: 'https://debatersconvention.com/sitemap.xml',
    }
}
