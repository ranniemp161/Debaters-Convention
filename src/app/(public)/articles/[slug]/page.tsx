import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { SocialShare } from "@/components/SocialShare"
import { CommentSection } from "@/components/CommentSection"
import { ReadMore } from "@/components/ReadMore"
import { Metadata } from "next"
import { ScrollProgress } from "@/components/ScrollProgress"

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
    const relatedArticles = await prisma.article.findMany({
        where: {
            slug: { not: slug },
            status: 'APPROVED'
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
        <article className="min-h-screen bg-background">
            <ScrollProgress />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* HERO SECTION */}
            <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[#1a1515] text-white">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    {article.featuredImage ? (
                        <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover opacity-50"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#2a2525]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-[#1a1515]/60 to-transparent" />
                </div>

                <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl space-y-6 pt-20">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase text-yellow-500/90">
                        {article.category && (
                            <span className="bg-yellow-500/20 px-3 py-1 rounded backdrop-blur-sm">
                                {article.category.name}
                            </span>
                        )}
                        <span className="text-zinc-300">•</span>
                        <span className="text-zinc-300">{new Date(article.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight decoration-yellow-500/30 underline decoration-1 underline-offset-8">
                        {article.title}
                    </h1>

                    {article.subtitle && (
                        <p className="text-xl md:text-2xl text-zinc-200 font-serif italic leading-relaxed max-w-2xl mx-auto">
                            {article.subtitle}
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-6 text-sm text-zinc-300 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-500 font-bold text-xs">
                                {article.author.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-white">{article.author.name || article.author.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{Math.ceil(article.content.length / 500)} min read</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <Button variant="ghost" asChild className="mb-8 -ml-4 text-muted-foreground hover:text-primary">
                    <Link href="/articles">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Articles
                    </Link>
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 relative">
                    {/* Main Content */}
                    <div className="space-y-8">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none 
                            prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
                            prose-p:text-muted-foreground prose-p:leading-8 prose-p:text-lg
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-l-4 prose-blockquote:border-yellow-500/50 prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic
                            prose-img:rounded-lg prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Tags */}
                        {article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-8 border-t">
                                {article.tags.map(tag => (
                                    <span key={tag.id} className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Social Share & Author Bio */}
                        <div className="space-y-12 pt-12">
                            <div className="flex items-center justify-between py-6 border-y">
                                <span className="font-serif font-bold text-lg">Share this article</span>
                                <SocialShare title={article.title} url={fullUrl} />
                            </div>

                            {/* Author Bio Card */}
                            <div className="bg-muted/30 p-8 rounded-lg border flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                                <div className="w-20 h-20 shrink-0 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 font-bold text-3xl font-serif">
                                    {article.author.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-serif font-bold">About {article.author.name || article.author.username}</h3>
                                    <p className="text-muted-foreground">
                                        Contributor to Debaters Convention. Passionate about exploring complex topics through reason and discourse.
                                    </p>
                                    <div className="pt-2">
                                        <Link href={`/author/${article.author.username}`} className="text-sm text-primary hover:underline">
                                            View all posts by this author →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="pt-12">
                            <CommentSection articleId={article.id} initialComments={article.comments} />
                        </div>
                    </div>

                </div>
            </div>

            {/* Read More */}
            <div className="bg-muted/30 py-16 border-t">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-serif font-bold mb-12 text-center">More Perspectives</h2>
                    <ReadMore articles={relatedArticles} />
                </div>
            </div>
        </article>
    )
}
