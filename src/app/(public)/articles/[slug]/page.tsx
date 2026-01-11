import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SocialShare } from "@/components/SocialShare"
import { CommentSection } from "@/components/CommentSection"
import { ReadMore } from "@/components/ReadMore"
import { Metadata } from "next"

// Helper to fetch article data
async function getArticle(slug: string) {
    return await prisma.article.findUnique({
        where: { slug },
        include: {
            author: true,
            category: true,
            tags: true,
            comments: {
                orderBy: { createdAt: 'desc' }
            }
        },
    })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const article = await getArticle(slug)

    if (!article) {
        return {
            title: 'Article Not Found',
        }
    }

    const title = article.title
    const description = article.subtitle || article.content.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...'
    const publishedTime = article.createdAt.toISOString()
    const modifiedTime = article.updatedAt.toISOString()
    const url = `https://debatersconvention.com/articles/${article.slug}`
    const images = article.featuredImage ? [article.featuredImage] : []

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime,
            modifiedTime,
            url,
            images,
            authors: [article.author.username],
            tags: article.tags.map(t => t.name),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images,
        },
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const article = await getArticle(slug)

    if (!article) {
        notFound()
    }

    // Fetch related articles (Read More)
    // Simple logic: fetch latest 3 published articles excluding current one
    const relatedArticles = await prisma.article.findMany({
        where: {
            slug: { not: slug },
            status: 'APPROVED' // Changed from PUBLISHED to APPROVED based on LandingPage query
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            featuredImage: true,
            createdAt: true,
        }
    })

    const fullUrl = `https://debatersconvention.com/articles/${article.slug}`

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.subtitle || article.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
        image: article.featuredImage ? [article.featuredImage] : [],
        datePublished: article.createdAt.toISOString(),
        dateModified: article.updatedAt.toISOString(),
        author: {
            '@type': 'Person',
            name: article.author.name || article.author.username,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Debaters Convention',
            logo: {
                '@type': 'ImageObject',
                url: 'https://debatersconvention.com/logo.png', // Placeholder URL
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': fullUrl,
        }
    }

    return (
        <article className="container mx-auto py-10 max-w-3xl space-y-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>

            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl leading-tight font-serif">
                    {article.title}
                </h1>
                {article.subtitle && (
                    <p className="text-2xl text-muted-foreground font-serif italic leading-relaxed">
                        {article.subtitle}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-4 text-muted-foreground">
                            <div className="font-medium text-foreground">
                                {article.author.username}
                            </div>
                            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                            <time dateTime={article.createdAt.toISOString()}>
                                {article.createdAt.toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                            {article.category && (
                                <>
                                    <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                                    <span className="text-primary font-medium">
                                        {article.category.name}
                                    </span>
                                </>
                            )}
                        </div>
                        {article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <span key={tag.id} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <SocialShare title={article.title} url={fullUrl} />
                </div>
            </div>

            {article.featuredImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="pt-8">
                <SocialShare title={article.title} url={fullUrl} />
            </div>

            <CommentSection articleId={article.id} initialComments={article.comments} />

            <ReadMore articles={relatedArticles} />
        </article>
    )
}
