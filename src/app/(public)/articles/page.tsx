import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Clock } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ArticlesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; topic?: string }>
}) {
    // Await params for Next.js 15+
    const params = await searchParams;
    const topic = params?.topic || 'All';
    const query = params?.q || '';

    // Fetch articles
    const articles = await prisma.article.findMany({
        where: {
            status: 'APPROVED',
            ...(query ? { title: { contains: query } } : {})
        },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        take: 9,
    })

    const categories = ["All", "Theology", "Philosophy", "Politics", "Ethics", "Culture"];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header / Hero Section */}
            <div className="bg-gradient-to-r from-primary to-[#8B0000] text-primary-foreground py-20">
                <div className="container mx-auto px-4 md:px-6 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Articles</h1>
                    <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl">
                        Explore in-depth discussions on theology, philosophy, politics, and more
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="border-b bg-background sticky top-16 z-30 shadow-sm">
                <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search articles..."
                            className="pl-9 bg-muted/50 border-none shadow-inner"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <Button variant="ghost" size="icon" className="md:hidden shrink-0">
                            <Filter className="h-4 w-4" />
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={topic === cat || (cat === 'All' && !topic) ? "default" : "secondary"}
                                size="sm"
                                className={`rounded-none px-6 font-medium ${topic === cat || (cat === 'All' && !topic) ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="container mx-auto px-4 md:px-6 py-16 space-y-8 bg-muted/10 flex-1">
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Showing {articles.length} articles</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <Card key={article.id} className="group flex flex-col overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
                            {/* Image Area */}
                            <div className="relative h-56 w-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-white/90 text-black text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1 uppercase tracking-wider backdrop-blur-sm">
                                        <Filter className="h-3 w-3" /> {/* Placeholder icon for category */}
                                        Philosophy {/* Mock Category */}
                                    </span>
                                </div>
                                {article.featuredImage ? (
                                    <img
                                        src={article.featuredImage}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 bg-gradient-to-br from-muted to-muted/50 group-hover:scale-105 transition-transform duration-500">
                                        Article Thumbnail
                                    </div>
                                )}
                            </div>

                            <CardHeader className="space-y-3 p-6 pb-2">
                                <div className="space-y-2">
                                    <CardTitle className="line-clamp-2 text-xl font-bold leading-snug group-hover:text-primary transition-colors font-serif">
                                        <Link href={`/articles/${article.slug}`}>
                                            {article.title}
                                        </Link>
                                    </CardTitle>
                                    {article.subtitle && (
                                        <p className="line-clamp-2 text-sm text-muted-foreground italic font-serif">
                                            {article.subtitle}
                                        </p>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 pt-2">
                                <div
                                    className="line-clamp-3 text-muted-foreground text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                            </CardContent>

                            <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between text-xs text-muted-foreground border-t bg-muted/5 p-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground">{article.author.username}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>{article.createdAt.toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 10 min</span>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {articles.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
                        <Button variant="link" className="text-primary mt-2">Clear filters</Button>
                    </div>
                )}
            </div>

            {/* Newsletter CTA */}
            <div className="bg-secondary py-20 text-secondary-foreground">
                <div className="container mx-auto px-4 md:px-6 text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Never Miss an Article</h2>
                        <p className="text-secondary-foreground/80 max-w-xl mx-auto text-lg">
                            Subscribe to our newsletter for weekly highlights and new perspectives.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-background/20 border-secondary-foreground/20 placeholder:text-secondary-foreground/50 h-12 text-lg focus-visible:ring-secondary-foreground/30"
                        />
                        <Button size="lg" className="h-12 px-8 font-bold bg-[#D32F2F] hover:bg-[#B71C1C] text-white border-none shadow-lg">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
