import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const article = await prisma.article.findUnique({
        where: { slug },
        include: { author: true },
    })

    if (!article) {
        notFound()
    }

    return (
        <article className="container mx-auto py-10 max-w-3xl space-y-8">
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
                    {article.status !== 'APPROVED' && (
                        <>
                            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                            <span className="text-yellow-600 font-medium capitalize">
                                {article.status.toLowerCase()}
                            </span>
                        </>
                    )}
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
        </article>
    )
}
