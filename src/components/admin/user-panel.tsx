'use client'

import { deleteUser } from "@/lib/admin-actions"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

type User = {
    id: string
    username: string
    role: string
    createdAt: Date
    _count?: {
        articles: number
    }
}

export function AdminUserPanel({ users }: { users: User[] }) {
    const [openId, setOpenId] = useState<string | null>(null)

    const handleKickUser = async (id: string) => {
        await deleteUser(id)
        setOpenId(null)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage writers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Articles</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user._count?.articles || 0}</TableCell>
                                    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {user.role !== 'ADMIN' && (
                                            <Dialog open={openId === user.id} onOpenChange={(open) => setOpenId(open ? user.id : null)}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="destructive">Kick</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Kick Writer?</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to kick <b>{user.username}</b>? This action cannot be undone and will delete their account.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setOpenId(null)}>Cancel</Button>
                                                        <Button variant="destructive" onClick={() => handleKickUser(user.id)}>Yes, Kick</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
