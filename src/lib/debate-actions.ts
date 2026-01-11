'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const DebateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    videoUrl: z.string().url("Must be a valid URL"),
})

export async function createDebate(formData: FormData) {
    const session = await auth()

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return { error: "Unauthorized" }
    }

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        videoUrl: formData.get('videoUrl'),
    }

    const result = DebateSchema.safeParse(rawData)

    if (!result.success) {
        return { error: "Validation Error: " + JSON.stringify(result.error.flatten().fieldErrors) }
    }

    try {
        await prisma.debate.create({
            data: {
                title: result.data.title,
                description: result.data.description,
                videoUrl: result.data.videoUrl,
            },
        })
        revalidatePath('/debates')
        revalidatePath('/admin/debates')
        return { success: true }
    } catch (error) {
        console.error("Create Debate Error:", error)
        return { error: "Failed to create debate" }
    }
}

export async function getDebates() {
    try {
        return await prisma.debate.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        console.error("Fetch Debates Error:", error)
        return []
    }
}

export async function getDebateById(id: string) {
    try {
        return await prisma.debate.findUnique({
            where: { id }
        })
    } catch (error) {
        console.error("Fetch Debate Error:", error)
        return null
    }
}

export async function deleteDebate(id: string) {
    const session = await auth()
    if (!session || !session.user || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.debate.delete({ where: { id } })
        revalidatePath('/debates')
        revalidatePath('/admin/debates')
    } catch (error) {
        console.error("Delete Debate Error:", error)
    }
}
