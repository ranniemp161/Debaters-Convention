"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createCommentSchema = z.object({
    articleId: z.string(),
    authorName: z.string().min(1, "Name is required").max(50, "Name is too long"),
    content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
})

export async function createComment(formData: FormData) {
    const rawData = {
        articleId: formData.get("articleId"),
        authorName: formData.get("authorName"),
        content: formData.get("content"),
    }

    const validatedData = createCommentSchema.safeParse(rawData)

    if (!validatedData.success) {
        return {
            success: false,
            message: validatedData.error.flatten().fieldErrors.content?.[0] || "Invalid input",
        }
    }

    const { articleId, authorName, content } = validatedData.data

    try {
        await prisma.comment.create({
            data: {
                articleId,
                authorName,
                content,
            },
        })

        revalidatePath(`/articles/${articleId}`) // We might need to handle slug revalidation properly
        // Actually the path is /articles/[slug], but revalidatePath usually works with exact path or page path.
        // Ideally we revalidate the specific url. But since we don't have slug here easily without fetching,
        // we can rely on page revalidation if we pass the path correctly from client or just revalidateTag if we were using fetch.
        // For now let's hope revalidatePath works or we might need to find the slug.

        // Better strategy: Return success and let client router.refresh() if needed, 
        // BUT server actions revalidatePath is best. 
        // Since we don't have the slug in the form data, we can't easily reconstruction the path `/articles/${slug}` without a DB call.
        // Let's modify the schema/form to pass slug if possible, or just fetch it. 
        // OR, we can just revalidatePath('/', 'layout') to be safe but expensive.
        // Let's fetch the slug.

        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: { slug: true }
        })

        if (article) {
            revalidatePath(`/articles/${article.slug}`)
        }

        return { success: true, message: "Comment posted successfully" }
    } catch (error) {
        console.error("Failed to create comment:", error)
        return { success: false, message: "Failed to post comment. Please try again." }
    }
}
