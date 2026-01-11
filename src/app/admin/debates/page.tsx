
import { createDebate, deleteDebate, getDebates } from "@/lib/debate-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trash2, Video } from "lucide-react"

export default async function AdminDebatesPage() {
    const debates = await getDebates()

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Manage Debates</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Debate</CardTitle>
                    <CardDescription>Enter the YouTube URL for the debate video.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        'use server'
                        await createDebate(formData)
                    }} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Title</label>
                            <Input id="title" name="title" placeholder="Debate Title" required />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <Textarea id="description" name="description" placeholder="Short description of the debate..." />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="videoUrl" className="text-sm font-medium">YouTube URL</label>
                            <Input id="videoUrl" name="videoUrl" type="url" placeholder="https://www.youtube.com/watch?v=..." required />
                        </div>

                        <Button type="submit">
                            <Video className="mr-2 h-4 w-4" />
                            Add Debate
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Existing Debates</h2>
                <div className="grid gap-4">
                    {debates.map((debate) => (
                        <Card key={debate.id} className="flex flex-row items-center justify-between p-4">
                            <div className="space-y-1">
                                <h3 className="font-semibold">{debate.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{debate.description}</p>
                                <p className="text-xs text-muted-foreground/80">{debate.videoUrl}</p>
                            </div>
                            <form action={async () => {
                                'use server'
                                await deleteDebate(debate.id)
                            }}>
                                <Button variant="destructive" size="icon" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </Card>
                    ))}
                    {debates.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">No debates found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
