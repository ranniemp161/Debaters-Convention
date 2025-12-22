
import { Editor } from "@/components/writer/editor"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    const { id } = await params

    if (!session || !session.user || session.user.role !== 'WRITER') {
        redirect('/')
    }

    const article = await prisma.article.findUnique({
        where: { id },
    })

    if (!article) {
        notFound()
    }

    if (article.authorId !== session.user.id) {
        redirect('/writer')
    }

    return <Editor article={article} />
}
