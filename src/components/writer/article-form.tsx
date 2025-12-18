'use client'

import { useState, useActionState } from 'react'
import { createArticle } from '@/lib/article-actions'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from './rich-text-editor'

const initialState = {
    message: '',
    errors: {},
}

export function ArticleForm() {
    const [state, formAction] = useActionState(createArticle, initialState)
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [content, setContent] = useState('')

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        // Simple slugify without external dependency
        const newSlug = newTitle
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        setSlug(newSlug)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Submit Article</CardTitle>
                <CardDescription>Share your thoughts with the convention.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter article title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />
                        {state?.errors?.title && (
                            <p className="text-sm text-red-500">{state.errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">/articles/</span>
                            <Input
                                id="slug"
                                name="slug"
                                placeholder="article-slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </div>
                        {state?.errors?.slug && (
                            <p className="text-sm text-red-500">{state.errors.slug}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <input type="hidden" name="content" value={content} />
                        <RichTextEditor content={content} onChange={setContent} />
                        {state?.errors?.content && (
                            <p className="text-sm text-red-500">{state.errors.content}</p>
                        )}
                    </div>
                    {state?.message && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}
                    <Button type="submit">Submit for Review</Button>
                </form>
            </CardContent>
        </Card>
    )
}
