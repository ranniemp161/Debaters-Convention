import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
    const articles = await prisma.article.findMany({
        where: { status: 'APPROVED' },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="container mx-auto py-16 space-y-12">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Explore the Debate</h1>
                <p className="text-xl text-muted-foreground">
                    Dive into a collection of thought-provoking articles, essays, and stories from our community.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-lg bg-muted/20 border-dashed">
                        <p className="text-muted-foreground text-lg">No articles found yet.</p>
                        <Button asChild variant="outline">
                            <Link href="/">Return Home</Link>
                        </Button>
                    </div>
                ) : (
                    articles.map((article) => (
                        <Card key={article.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-muted-foreground/20">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-4">
                                    <CardTitle className="line-clamp-2 leading-tight text-xl">
                                        <Link href={`/articles/${article.slug}`} className="hover:text-primary transition-colors">
                                            {article.title}
                                        </Link>
                                    </CardTitle>
                                </div>
                                <CardDescription className="flex items-center gap-2 mt-2">
                                    <span className="font-semibold text-foreground">{article.author.username}</span>
                                    <span>•</span>
                                    <span>{article.createdAt.toLocaleDateString()}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div
                                    className="line-clamp-4 text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                            </CardContent>
                            <div className="p-6 pt-0 mt-auto">
                                <Button asChild variant="secondary" className="w-full group">
                                    <Link href={`/articles/${article.slug}`}>
                                        Read Article
                                        <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
