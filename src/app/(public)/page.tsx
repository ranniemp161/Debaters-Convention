import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const featuredArticles = await prisma.article.findMany({
    where: { status: 'APPROVED' },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 md:py-48 lg:py-56 bg-gradient-to-br from-background via-muted/50 to-background">
        <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="w-fit mx-auto text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 drop-shadow-sm">
              The Debaters Convention
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-xl md:text-2xl leading-relaxed">
              Where intellect meets passion. Explore curated articles, engage in discourse, and share your perspective with the world.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              <Link href="/articles">
                Start Reading <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2">
              <Link href="/about">Our Mission</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features / Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Curated Content</h3>
            <p className="text-muted-foreground">High-quality articles reviewed by experts.</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Users className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Community Driven</h3>
            <p className="text-muted-foreground">Voices from diverse backgrounds.</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <ArrowRight className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Join the Debate</h3>
            <p className="text-muted-foreground">Write and share your own stories.</p>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container py-24 px-4 md:px-6 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Latest Discussions</h2>
            <p className="text-muted-foreground text-lg">Fresh perspectives from our writers.</p>
          </div>
          <Button asChild variant="ghost" className="hidden md:inline-flex group">
            <Link href="/articles">
              View all articles <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <Card key={article.id} className="group flex flex-col overflow-hidden border-muted-foreground/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{article.author.username}</span>
                    <span>{article.createdAt.toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div
                  className="line-clamp-3 text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:hidden text-center mt-8">
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/articles">View all articles</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
