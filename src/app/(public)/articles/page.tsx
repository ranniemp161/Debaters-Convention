import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, User } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ArticlesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; topic?: string }>
}) {
    const params = await searchParams;
    const topic = params?.topic || 'All';
    const query = params?.q || '';

    // Fetch articles (take 1 for hero + 8 for grid = 9 total)
    const articles = await prisma.article.findMany({
        where: {
            status: 'APPROVED',
            ...(query ? { title: { contains: query } } : {}),
            ...(topic && topic !== 'All' ? { category: { name: topic } } : {})
        },
        include: {
            author: true,
            category: true,
            tags: true
        },
        orderBy: { createdAt: 'desc' },
        take: 9,
    })

    const heroArticle = articles[0];
    const otherArticles = articles.slice(1);

    return (
        <div className="flex flex-col min-h-screen bg-background">

            {/* HER ARTICLE SECTION */}
            {heroArticle && (
                <section className="relative w-full h-[600px] flex items-center bg-[#1a1515] text-white overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        {heroArticle.featuredImage ? (
                            <img
                                src={heroArticle.featuredImage}
                                alt={heroArticle.title}
                                className="w-full h-full object-cover opacity-60"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#2a2525]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1515] via-[#1a1515]/80 to-transparent" />
                    </div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="flex items-center gap-3 text-xs md:text-sm font-bold tracking-widest uppercase text-yellow-500/90">
                                <span className="bg-yellow-500/20 px-2 py-1 rounded">Feature Debate</span>
                                <span className="flex items-center gap-1 text-zinc-300">
                                    <Clock className="w-3 h-3" /> {Math.ceil(heroArticle.content.length / 500)} min read
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight decoration-yellow-500/30 underline decoration-1 underline-offset-8">
                                <Link href={`/articles/${heroArticle.slug}`} className="hover:text-yellow-500/90 transition-colors">
                                    {heroArticle.title}
                                </Link>
                            </h1>

                            <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed max-w-xl line-clamp-3">
                                {(() => {
                                    const html = heroArticle.content;
                                    const spacedHtml = html.replace(/<\/(p|div|h[1-6]|li|blockquote)>| <br\/?>| <br>/gi, ' ');
                                    const text = spacedHtml.replace(/<[^>]*>?/gm, '').trim().replace(/\s+/g, ' ');
                                    return text;
                                })()}
                            </p>

                            <div className="flex items-center gap-4 pt-4">
                                <div className="w-12 h-12 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-500 font-bold text-lg">
                                    {heroArticle.author?.username?.charAt(0).toUpperCase() || "A"}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm md:text-base">{heroArticle.author?.name || heroArticle.author?.username}</p>
                                    <p className="text-zinc-400 text-xs uppercase tracking-wider">Author</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* LATEST PERSPECTIVES GRID */}
            <section className="container mx-auto px-4 md:px-6 py-24 max-w-7xl">
                <div className="flex items-baseline justify-between mb-12 border-b pb-4">
                    <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Latest Perspectives</h2>

                    {/* View Options (Visual Only for now) */}
                    <div className="hidden md:flex gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-foreground text-background rounded cursor-pointer">
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-2 h-2 bg-current rounded-[1px]"></div>
                                <div className="w-2 h-2 bg-current rounded-[1px]"></div>
                                <div className="w-2 h-2 bg-current rounded-[1px]"></div>
                                <div className="w-2 h-2 bg-current rounded-[1px]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-16">
                    {otherArticles.map((article) => (
                        <div key={article.id} className="group flex flex-col gap-4">
                            {/* Card Image */}
                            <div className="relative aspect-[16/9] overflow-hidden rounded bg-muted">
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-foreground text-background text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-xl">
                                        {article.category?.name || "Opinion"}
                                    </span>
                                </div>
                                <Link href={`/articles/${article.slug}`}>
                                    {article.featuredImage ? (
                                        <img
                                            src={article.featuredImage}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-muted-foreground italic">
                                            No Image
                                        </div>
                                    )}
                                </Link>
                            </div>

                            {/* Card Content */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-xs font-bold text-[#C04928] uppercase tracking-wide">
                                    <span>{new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground">{Math.ceil(article.content.length / 500)} min read</span>
                                </div>

                                <h3 className="text-2xl font-serif font-bold leading-tight group-hover:underline decoration-2 underline-offset-4 decoration-primary/50 transition-all">
                                    <Link href={`/articles/${article.slug}`}>
                                        {article.title}
                                    </Link>
                                </h3>

                                <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm">
                                    {(() => {
                                        const html = article.content;
                                        const spacedHtml = html.replace(/<\/(p|div|h[1-6]|li|blockquote)>| <br\/?>| <br>/gi, ' ');
                                        const text = spacedHtml.replace(/<[^>]*>?/gm, '').trim().replace(/\s+/g, ' ');
                                        return text;
                                    })()}
                                </p>

                                <div className="pt-2 flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                                        {article.author?.name || article.author?.username}
                                    </span>
                                </div>
                            </div>
                            <div className="h-px w-full bg-border/40 mt-4 group-hover:bg-primary/20 transition-colors"></div>
                        </div>
                    ))}
                </div>

                {otherArticles.length === 0 && !heroArticle && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No articles found.</p>
                    </div>
                )}
            </section>
        </div>
    )
}
