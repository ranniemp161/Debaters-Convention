import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ArticleSummary {
    id: string
    title: string
    slug: string
    featuredImage?: string | null
    createdAt: Date
}

interface ReadMoreProps {
    articles: ArticleSummary[]
}

export function ReadMore({ articles }: ReadMoreProps) {
    if (articles.length === 0) return null

    return (
        <section className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-bold font-serif">Read More</h2>
            <div className="grid gap-6 md:grid-cols-3">
                {articles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group block h-full">
                        <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
                            {article.featuredImage && (
                                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={article.featuredImage}
                                        alt={article.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="line-clamp-2 group-hover:underline decoration-primary underline-offset-4">
                                    {article.title}
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    )
}
