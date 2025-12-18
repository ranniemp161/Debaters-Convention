'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const ArticleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().min(1, "Content is required"),
})

export async function createArticle(prevState: any, formData: FormData) {
    const session = await auth()

    if (!session || !session.user || session.user.role !== 'WRITER') {
        return { message: "Unauthorized" }
    }

    const validatedFields = ArticleSchema.safeParse({
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Article.',
        }
    }

    const { title, slug, content } = validatedFields.data

    try {
        await prisma.article.create({
            data: {
                title,
                slug,
                content,
                authorId: session.user.id,
            },
        })
    } catch (error) {
        return { message: 'Database Error: Failed to Create Article.' }
    }

    revalidatePath('/writer')
    redirect('/writer')
}
