"use client"

import { useState } from "react"
import { createComment } from "@/lib/comment-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Comment {
    id: string
    content: string
    authorName: string
    createdAt: Date
}

interface CommentSectionProps {
    articleId: string
    initialComments: Comment[]
}

export function CommentSection({ articleId, initialComments }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setError(null)

        // Add articleId to formData
        formData.append("articleId", articleId)

        const result = await createComment(formData)

        if (result.success) {
            // Optimistic update or just wait for revalidation?
            // Since createComment revalidates, we might get the new list if we use router.refresh() 
            // but here we can just append it locally for instant feedback if we had the full object.
            // But we don't have the ID or createdAt from the action response.
            // Let's just reset the form and rely on a full page reload or router.refresh() if needed.
            // Actually, passing the new comment back from action is better.
            // For now, let's just refresh the page via window.location.reload() for simplicity or 
            // ideally assume revalidatePath updated the data passed to this component? 
            // No, this component got initialComments as prop. It won't update unless parent re-renders.

            // Let's rely on standard form submission and simple reload for now or fetch.
            // To make it smooth, maybe we just show a success message or reload.
            window.location.reload()
        } else {
            setError(result.message || "Something went wrong")
        }
        setIsSubmitting(false)
    }

    return (
        <section className="space-y-8">
            <h2 className="text-2xl font-bold font-serif">Comments ({comments.length})</h2>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                        <Avatar>
                            <AvatarFallback>{comment.authorName[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{comment.authorName}</span>
                                <span className="text-sm text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-foreground/90">{comment.content}</p>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <p className="text-muted-foreground italic">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Leave a Comment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                name="authorName"
                                placeholder="Your Name"
                                required
                                className="max-w-xs"
                            />
                        </div>
                        <div>
                            <Textarea
                                name="content"
                                placeholder="Share your thoughts..."
                                required
                                className="min-h-[100px]"
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}
