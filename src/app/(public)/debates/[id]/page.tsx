
import { getDebateById } from "@/lib/debate-actions"
import { notFound } from "next/navigation"

function getYouTubeEmbedUrl(url: string) {
    try {
        const urlObj = new URL(url);
        let videoId = urlObj.searchParams.get("v");
        if (!videoId && urlObj.hostname === "youtu.be") {
            videoId = urlObj.pathname.slice(1);
        }
        if (!videoId && urlObj.pathname.includes("/embed/")) {
            videoId = urlObj.pathname.split("/embed/")[1];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
        return null;
    }
}

export const revalidate = 60 // ISR

export default async function DebatePage({ params }: { params: { id: string } }) {
    const { id } = await params
    const debate = await getDebateById(id)

    if (!debate) {
        notFound()
    }

    const embedUrl = getYouTubeEmbedUrl(debate.videoUrl)

    return (
        <div className="container mx-auto py-12 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl ring-1 ring-white/10">
                    {embedUrl ? (
                        <iframe
                            src={`${embedUrl}?autoplay=1`}
                            title={debate.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-white/50">
                            Video Unavailable
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">{debate.title}</h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                        <p className="whitespace-pre-wrap">{debate.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
