'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { supabase } from "@/lib/supabase"

const ArticleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().optional(),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().optional().default(""), // Allow empty for initial drafts
    featuredImage: z.any().optional().nullable(), // Allow File or string
    status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED']).optional(),
    categoryId: z.string().optional(),
    tags: z.string().optional(), // Expecting comma separated string
})

async function uploadFile(file: File): Promise<string | null> {
    if (!file || file.size === 0 || !file.name) {
        return null
    }

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`

    try {
        const { data, error } = await supabase
            .storage
            .from('upload')
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            throw new Error(error.message)
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from('upload')
            .getPublicUrl(filename)

        return publicUrl
    } catch (error: any) {
        throw new Error(error.message || "Failed to upload image")
    }
}

export async function uploadEditorImage(formData: FormData) {
    const session = await auth()
    if (!session || !session.user || session.user.role !== 'WRITER') {
        return { error: "Unauthorized" }
    }

    const file = formData.get('file') as File
    if (!file) {
        return { error: "No file provided" }
    }

    try {
        const url = await uploadFile(file)
        if (!url) {
            return { error: "Upload failed" }
        }
        return { url }
    } catch (error: any) {
        return { error: error.message || "Upload failed" }
    }
}

export async function createArticle(prevState: any, formData: FormData) {
    const session = await auth()

    if (!session || !session.user || session.user.role !== 'WRITER') {
        return { message: "Unauthorized" }
    }

    const validatedFields = ArticleSchema.safeParse({
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        featuredImage: formData.get('featuredImage'),
        status: formData.get('status') || 'PENDING',
        categoryId: formData.get('categoryId'),
        tags: formData.get('tags'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Article.',
        }
    }

    let { title, subtitle, slug, content, featuredImage, status, categoryId, tags } = validatedFields.data
    let featuredImageUrl: string | null = null

    if (featuredImage instanceof File) {
        try {
            featuredImageUrl = await uploadFile(featuredImage)
        } catch (e) {
            return { message: 'Image Upload Failed.' }
        }
    } else if (typeof featuredImage === 'string') {
        featuredImageUrl = featuredImage
    }

    // Process tags
    const tagNames = tags ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : []
    const tagConnectOrCreate = tagNames.map(name => ({
        where: { name },
        create: { name },
    }))

    try {
        await prisma.article.create({
            data: {
                title,
                subtitle: subtitle || null,
                slug,
                content,
                featuredImage: featuredImageUrl,
                status: status || 'PENDING',
                authorId: session.user.id,
                categoryId: categoryId || null,
                tags: {
                    connectOrCreate: tagConnectOrCreate
                }
            },
        })
    } catch (error) {
        console.error("Create Article Error:", error)
        return { message: 'Database Error: Failed to Create Article.' }
    }

    revalidatePath('/writer')
    redirect('/writer')
}

export async function updateArticle(articleId: string, prevState: any, formData: FormData) {
    const session = await auth()

    if (!session || !session.user || session.user.role !== 'WRITER') {
        return { message: "Unauthorized" }
    }

    const validatedFields = ArticleSchema.safeParse({
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        featuredImage: formData.get('featuredImage'),
        status: formData.get('status'),
        categoryId: formData.get('categoryId'),
        tags: formData.get('tags'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Article.',
        }
    }

    let { title, subtitle, slug, content, featuredImage, status, categoryId, tags } = validatedFields.data
    let featuredImageUrl: string | null | undefined = undefined

    if (featuredImage instanceof File && featuredImage.size > 0) {
        try {
            const url = await uploadFile(featuredImage)
            if (url) featuredImageUrl = url
        } catch (e) {
            return { message: 'Image Upload Failed.' }
        }
    } else if (typeof featuredImage === 'string') {
        featuredImageUrl = featuredImage
    }

    // Process tags
    const tagNames = tags ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : []

    // We need to disconnect all existing tags and connect new ones to do a "replace"
    // But connectOrCreate doesn't handle disconnection of removed tags automatically in a simple update call unless we explicitly set relation.
    // The easiest way for many-to-many replacement in Prisma is:
    // tags: { set: [], connectOrCreate: [...] }

    const tagConnectOrCreate = tagNames.map(name => ({
        where: { name },
        create: { name },
    }))

    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
        })

        if (!article || article.authorId !== session.user.id) {
            return { message: "Unauthorized: You do not own this article." }
        }

        const dataToUpdate: any = {
            title,
            subtitle: subtitle || null,
            slug,
            content,
            status: status ?? undefined,
            categoryId: categoryId || null,
            tags: {
                set: [], // Clear existing tags
                connectOrCreate: tagConnectOrCreate,
            }
        }

        if (featuredImageUrl !== undefined) {
            dataToUpdate.featuredImage = featuredImageUrl
        } else if (formData.get('isImageRemoved') === 'true') {
            dataToUpdate.featuredImage = null
        }

        await prisma.article.update({
            where: { id: articleId },
            data: dataToUpdate,
        })
    } catch (error) {
        console.error("Update Article Error:", error)
        return { message: 'Database Error: Failed to Update Article.' }
    }

    revalidatePath('/writer')
    redirect('/writer')
}

// Force TS update
