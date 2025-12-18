import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function WriterDashboard() {
    const session = await auth()

    if (!session?.user) return null

    const articles = await prisma.article.findMany({
        where: { authorId: session.user.id },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">My Articles</h2>
                <Button asChild>
                    <Link href="/writer/submit">Create New Article</Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Created At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4">
                                    No articles found. Start writing!
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${article.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                article.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {article.status.toLowerCase()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {article.createdAt.toLocaleDateString()}
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
