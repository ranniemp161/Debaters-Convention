import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, MessageSquare } from "lucide-react"

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
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 py-24 md:py-32 lg:py-40 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <div className="bg-secondary text-secondary-foreground inline-block px-3 py-1 rounded-sm text-sm font-semibold tracking-wide">
              Welcome to Debaters Convention
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              Where <span className="text-secondary">Diverse Views</span> <br />
              Meet Bold Dialogue
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl max-w-[600px] leading-relaxed">
              Engaging in meaningful conversations on theology, philosophy, politics, and beyond. Join a community that values thoughtful discourse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild variant="secondary" size="lg" className="text-base font-bold px-8 h-12">
                <Link href="/articles">
                  Explore Articles <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-primary/10 border-white/30 hover:bg-white/10 text-white hover:text-white text-base font-bold px-8 h-12">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          {/* Image Placeholder / Visual */}
          <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden shadow-2xl bg-black/20">
            {/* Note: This would typically be an Image component. Using a placeholder div for now matching the user's uploaded image style */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent z-10"></div>
            {/* We can use a generated placeholder or leave it blank if no specific image asset is available yet. 
                 Ideally, we'd use <Image src="/hero-image.jpg" ... /> */}
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/20">
              <span className="text-lg">Hero Image Area</span>
            </div>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
      </section>

      {/* Explore Topics Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6 text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Explore Our Topics</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dive deep into conversations that matter across multiple disciplines
          </p>
        </div>

        <div className="container px-4 md:px-6 grid md:grid-cols-3 gap-8">
          {/* Theology */}
          <div className="group p-8 rounded-xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mb-6">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Theology</h3>
            <p className="text-muted-foreground mb-4">
              Engaging discussions and thought-provoking perspectives on theology.
            </p>
            <Link href="/articles?topic=theology" className="text-primary font-semibold inline-flex items-center hover:underline">
              Explore <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Philosophy */}
          <div className="group p-8 rounded-xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center mb-6">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Philosophy</h3>
            <p className="text-muted-foreground mb-4">
              Engaging discussions and thought-provoking perspectives on philosophy.
            </p>
            <Link href="/articles?topic=philosophy" className="text-secondary-foreground/80 hover:text-secondary-foreground font-semibold inline-flex items-center hover:underline">
              Explore <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Politics */}
          <div className="group p-8 rounded-xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mb-6">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Politics</h3>
            <p className="text-muted-foreground mb-4">
              Engaging discussions and thought-provoking perspectives on politics.
            </p>
            <Link href="/articles?topic=politics" className="text-primary font-semibold inline-flex items-center hover:underline">
              Explore <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="container py-24 px-4 md:px-6 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-left">Featured Articles</h2>
          <Button asChild variant="ghost" className="hidden md:inline-flex group text-primary hover:text-primary/80">
            <Link href="/articles">
              View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <Card key={article.id} className="group flex flex-col overflow-hidden border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-card">
              <div className="relative h-48 w-full bg-muted overflow-hidden">
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-muted-foreground">
                    Article Image
                  </div>
                )}
                {/* Tag */}
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm">
                  Opinion
                </div>
              </div>
              <CardHeader className="space-y-3 p-6 pb-2">
                <CardTitle className="line-clamp-2 text-xl font-bold group-hover:text-primary transition-colors">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
                <div
                  className="line-clamp-3 text-muted-foreground text-sm leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                <Link href={`/articles/${article.slug}`} className="text-primary text-sm font-bold inline-flex items-center hover:underline uppercase tracking-wide">
                  Read More <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
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

      {/* Footer CTA */}
      <section className="bg-primary text-primary-foreground py-24">
        <div className="container px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">Join the Conversation</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg md:text-xl">
            Be part of a community that values diverse perspectives and thoughtful dialogue.
          </p>
          <div className="pt-4">
            <Button asChild variant="secondary" size="lg" className="h-12 px-8 font-bold text-base">
              <Link href="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
