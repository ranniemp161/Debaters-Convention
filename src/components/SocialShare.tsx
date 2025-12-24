"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Linkedin, Twitter, Share2 } from "lucide-react"

interface SocialShareProps {
    title: string
    url: string // We will construct this in the parent or pass generic
}

export function SocialShare({ title, url }: SocialShareProps) {
    const fullUrl = url


    const shareLinks = [
        {
            name: "Twitter",
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
        },
        {
            name: "Facebook",
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`,
        },
    ]

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: fullUrl,
                })
            } catch (err) {
                console.error("Error sharing:", err)
            }
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Share:</span>
            {shareLinks.map((link) => (
                <Button
                    key={link.name}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    <a href={link.href} target="_blank" rel="noopener noreferrer" title={`Share on ${link.name}`}>
                        <link.icon className="h-4 w-4" />
                        <span className="sr-only">{link.name}</span>
                    </a>
                </Button>
            ))}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground md:hidden"
                onClick={handleNativeShare}
                title="Share"
            >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
            </Button>
        </div>
    )
}
