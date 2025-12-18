import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { updateArticleStatus } from "@/lib/admin-actions"

export default async function AdminPage() {
    const session = await auth()

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    const pendingArticles = await prisma.article.findMany({
        where: { status: 'PENDING' },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="container mx-auto py-10 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingArticles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                    No pending articles to review.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pendingArticles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>{article.author.username}</TableCell>
                                    <TableCell>{article.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <form action={async () => {
                                            'use server'
                                            await updateArticleStatus(article.id, 'APPROVED')
                                        }} className="inline-block">
                                            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                                                Approve
                                            </Button>
                                        </form>
                                        <form action={async () => {
                                            'use server'
                                            await updateArticleStatus(article.id, 'REJECTED')
                                        }} className="inline-block">
                                            <Button size="sm" variant="destructive">
                                                Reject
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
