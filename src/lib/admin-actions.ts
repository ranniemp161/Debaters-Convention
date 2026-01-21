'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateArticleStatus(articleId: string, status: string) {
    let session
    try {
        session = await auth()
    } catch {
        session = null
    }

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return { message: "Unauthorized" }
    }

    if (status === 'REJECTED') {
        try {
            await prisma.article.delete({
                where: { id: articleId },
            })
        } catch (error) {
            return { message: "Database Error: Failed to delete rejected article." }
        }
    } else {
        try {
            await prisma.article.update({
                where: { id: articleId },
                data: { status },
            })
        } catch (error) {
            return { message: "Database Error: Failed to update article status." }
        }
    }

    revalidatePath('/admin')
    revalidatePath('/')
}

export async function deleteUser(userId: string) {
    let session
    try {
        session = await auth()
    } catch {
        session = null
    }

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return { message: "Unauthorized" }
    }

    try {
        await prisma.user.delete({
            where: { id: userId },
        })
    } catch (error) {
        return { message: "Database Error: Failed to delete user." }
    }

    revalidatePath('/admin')
}

export async function deleteArticle(articleId: string) {
    let session
    try {
        session = await auth()
    } catch {
        session = null
    }

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return { message: "Unauthorized" }
    }

    try {
        await prisma.article.delete({
            where: { id: articleId },
        })
    } catch (error) {
        return { message: "Database Error: Failed to delete article." }
    }

    revalidatePath('/admin')
    revalidatePath('/')
}
