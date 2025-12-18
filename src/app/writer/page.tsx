
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function WriterDashboard() {
    const session = await auth()

    if (!session || !session.user) {
        redirect('/')
    }

    const articles = await prisma.article.findMany({
        where: { authorId: session.user.id },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>
                    <p className="text-muted-foreground">Manage your content and track approval status.</p>
                </div>
                <Button asChild>
                    <Link href="/writer/submit">
                        <Plus className="mr-2 h-4 w-4" />
                        New Article
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    You haven't written any articles yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            article.status === 'APPROVED' ? 'default' :
                                                article.status === 'REJECTED' ? 'destructive' : 'secondary'
                                        }>
                                            {article.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{article.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {article.status === 'APPROVED' && (
                                            <Button variant="link" size="sm" asChild>
                                                <Link href={`/articles/${article.slug}`}>View Live</Link>
                                            </Button>
                                        )}
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
