import { getDebates } from "@/lib/debate-actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { PlayCircle } from "lucide-react"

interface Debate {
    id: string
    title: string
    description: string | null
    videoUrl: string
    createdAt: Date
    updatedAt: Date
}

function getYouTubeThumbnail(url: string) {
    try {
        const urlObj = new URL(url);
        let videoId = urlObj.searchParams.get("v");
        if (!videoId && urlObj.hostname === "youtu.be") {
            videoId = urlObj.pathname.slice(1);
        }
        if (!videoId && urlObj.pathname.includes("/embed/")) {
            videoId = urlObj.pathname.split("/embed/")[1];
        }
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    } catch (e) {
        return null;
    }
}

export const revalidate = 60 // ISR

export default async function DebatesPage() {
    const debates = await getDebates()

    return (
        <div className="container mx-auto py-12 px-6">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight font-serif">Debate Archive</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explore our curated collection of significant debates. Watch the clash of ideas unfold.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {debates.map((debate: Debate) => {
                    const thumbnailUrl = getYouTubeThumbnail(debate.videoUrl)

                    return (
                        <Link key={debate.id} href={`/debates/${debate.id}`} className="group">
                            <Card className="overflow-hidden flex flex-col h-full border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="aspect-video w-full bg-muted relative overflow-hidden">
                                    {thumbnailUrl ? (
                                        <>
                                            <img
                                                src={thumbnailUrl}
                                                alt={debate.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                            No Thumbnail
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{debate.title}</CardTitle>
                                    {debate.description && (
                                        <CardDescription className="line-clamp-3 mt-2">
                                            {debate.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {debates.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No debates have been archived yet.</p>
                </div>
            )}
        </div>
    )
}
