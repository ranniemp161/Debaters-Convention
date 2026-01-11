import { Skeleton } from "../../../../components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Loading() {
    return (
        <div className="container mx-auto py-10 max-w-3xl space-y-8">
            <Button variant="ghost" disabled className="-ml-4 text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Button>

            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" /> {/* Title */}
                <Skeleton className="h-8 w-1/2" /> {/* Subtitle */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-4 w-24" /> {/* Author */}
                            <div className="h-1 w-1 rounded-full bg-muted" />
                            <Skeleton className="h-4 w-32" /> {/* Date */}
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-24" /> {/* Social Share */}
                </div>
            </div>

            <Skeleton className="aspect-video w-full rounded-lg" /> {/* Featured Image */}

            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    )
}
