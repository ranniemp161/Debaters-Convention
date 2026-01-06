import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, MessageSquare } from "lucide-react"
import Image from "next/image"
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
      <section className="relative w-full bg-background overflow-hidden border-b flex flex-col lg:block">


        {/* Visual Layer - Full Bleed */}
        <div className="relative w-full h-[50vh] lg:absolute lg:top-0 lg:right-0 lg:w-1/2 lg:h-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden order-1 lg:order-2 z-0">
          {/* Hero Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero-image.png"
              alt="Philosophy Bust"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay for blending */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-background via-transparent to-transparent z-10 lg:w-2/3"></div>
          </div>

          {/* Live Now Card */}
          <div className="absolute bottom-6 right-6 lg:bottom-12 lg:right-12 z-20 bg-background/95 backdrop-blur-sm p-6 w-[280px] shadow-2xl border-l-4 border-[#C04928]">
            <p className="text-secondary-foreground/70 font-bold text-xs tracking-widest uppercase mb-2">Live Now</p>
            <h3 className="text-foreground font-serif font-bold text-xl leading-tight mb-3">The Ethics of AI Consciousness</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              1,240 Watching
            </div>
          </div>
        </div>

        {/* Content Container - Aligned */}
        <div className="container mx-auto px-4 relative z-10 order-2 lg:order-1 h-full pointer-events-none">
          <div className="grid lg:grid-cols-2 lg:min-h-[calc(100vh-4rem)] items-center h-full">
            {/* Left Content */}
            <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 lg:py-0 pointer-events-auto">
              <div className="w-12 h-1 bg-secondary mb-8"></div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                Where <br />
                <span className="font-serif text-secondary/90 italic">Minds</span> <br />
                Collide
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground/80 max-w-lg mb-10 leading-relaxed font-light">
                A sanctuary for rigorous dialectic in philosophy and theology. Challenge your assumptions in an era of intellectual modernism.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-[#C04928] hover:bg-[#A03518] text-white rounded-none px-8 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Link href="/articles">
                    Watch Latest Debate
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none px-8 py-7 text-lg font-semibold border-input bg-transparent hover:bg-muted transition-all text-foreground">
                  <Link href="/articles?topic=all">
                    Explore Topics <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Spacer */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
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
