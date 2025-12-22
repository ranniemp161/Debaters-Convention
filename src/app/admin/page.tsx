import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminArticlePanel } from "@/components/admin/article-panel"

export default async function AdminPage() {
    const session = await auth()

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    const articles = await prisma.article.findMany({
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="container mx-auto py-10 space-y-6">
            <AdminArticlePanel articles={articles} />
        </div>
    )
}
