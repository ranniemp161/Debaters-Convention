
import { Editor } from "@/components/writer/editor"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"

export default async function NewArticlePage() {
    const session = await auth()

    if (!session || !session.user || session.user.role !== 'WRITER') {
        redirect('/')
    }

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })

    return <Editor categories={categories} />
}
