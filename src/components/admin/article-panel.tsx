'use client'

import { updateArticleStatus } from "@/lib/admin-actions"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Article = {
    id: string
    title: string
    status: string
    createdAt: Date
    author: {
        username: string
    }
}

export function AdminArticlePanel({ articles }: { articles: Article[] }) {

    const pendingArticles = articles.filter(a => a.status === 'PENDING')
    const approvedArticles = articles.filter(a => a.status === 'APPROVED')
    const rejectedArticles = articles.filter(a => a.status === 'REJECTED')

    const handleStatusUpdate = async (id: string, status: string) => {
        await updateArticleStatus(id, status)
    }

    const ArticleTable = ({ data, showActions = false }: { data: Article[], showActions?: boolean }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    {showActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={showActions ? 4 : 3} className="text-center py-4">
                            No articles found.
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((article) => (
                        <TableRow key={article.id}>
                            <TableCell className="font-medium">{article.title}</TableCell>
                            <TableCell>{article.author.username}</TableCell>
                            <TableCell>{article.createdAt.toLocaleDateString()}</TableCell>
                            {showActions && (
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusUpdate(article.id, 'APPROVED')}>
                                        Approve
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusUpdate(article.id, 'REJECTED')}>
                                        Discard
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Article Management</CardTitle>
                <CardDescription>Review and manage submissions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending">
                    <TabsList>
                        <TabsTrigger value="pending">Pending ({pendingArticles.length})</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">
                        <ArticleTable data={pendingArticles} showActions={true} />
                    </TabsContent>
                    <TabsContent value="approved">
                        <ArticleTable data={approvedArticles} />
                    </TabsContent>
                    <TabsContent value="rejected">
                        <ArticleTable data={rejectedArticles} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
