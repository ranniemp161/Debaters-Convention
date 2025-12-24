'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { createArticle, updateArticle } from '@/lib/article-actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from './rich-text-editor'
import { ArrowLeft, Save, Globe, ImageIcon, X, Upload } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Article = {
    id: string
    title: string
    subtitle?: string | null
    slug: string
    content: string
    featuredImage?: string | null
    status: string
    categoryId?: string | null
    tags?: { id: string; name: string }[]
}

type Category = {
    id: string
    name: string
}

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
}

export function Editor({ article, categories = [] }: { article?: Article; categories?: Category[] }) {
    const isEditing = !!article
    const updateArticleWithId = isEditing ? updateArticle.bind(null, article.id) : createArticle

    // cast to any to avoid type conflicts with the action state signature which might vary slightly
    const [state, formAction] = useActionState(updateArticleWithId as any, initialState)

    const [title, setTitle] = useState(article?.title || '')
    const [subtitle, setSubtitle] = useState(article?.subtitle || '')
    const [slug, setSlug] = useState(article?.slug || '')
    const [content, setContent] = useState(article?.content || '')
    const [featuredImage, setFeaturedImage] = useState(article?.featuredImage || '')

    // Auto-generate slug from title only if creating a new article and slug hasn't been manually touched
    const [slugTouched, setSlugTouched] = useState(!!article?.slug)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFeaturedImage(URL.createObjectURL(file))
        }
    }

    const handleRemoveImage = () => {
        setFeaturedImage('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)

        if (!slugTouched && !isEditing) {
            const newSlug = newTitle
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
            setSlug(newSlug)
        }
    }

    return (
        <form action={formAction} className="min-h-screen flex flex-col bg-background font-sans">
            {/* Top Bar */}
            <header className="border-b bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/writer">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex flex-col">
                        <span className="font-semibold">{isEditing ? 'Edit Post' : 'New Post'}</span>
                        <span className="text-xs text-muted-foreground">{state?.message || (isEditing ? 'Last saved...' : 'Draft')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="submit" name="status" value="DRAFT" variant="secondary" size="sm">
                        Save Draft
                    </Button>
                    <Button type="submit" name="status" value="PENDING" size="sm" className="gap-2">
                        <Save className="h-4 w-4" />
                        {isEditing && article?.status === 'APPROVED' ? 'Update' : 'Publish'}
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-3xl mx-auto space-y-6 pb-32">
                        {/* Title Input - Big and distinct serif */}
                        <div className="space-y-2">
                            <Input
                                name="title"
                                placeholder="Article Title"
                                value={title}
                                onChange={handleTitleChange}
                                className="text-5xl md:text-6xl font-black tracking-tight border-none shadow-none px-0 py-8 h-auto placeholder:text-muted-foreground/30 focus-visible:ring-0 bg-transparent font-serif leading-tight"
                                required
                            />
                            {state?.errors?.title && (
                                <p className="text-sm text-red-500">{state.errors.title}</p>
                            )}
                        </div>

                        {/* Subtitle Input - Medium style */}
                        <div className="space-y-4">
                            <Input
                                name="subtitle"
                                placeholder="Tell your story..."
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="text-2xl text-muted-foreground border-none shadow-none px-0 py-2 h-auto placeholder:text-muted-foreground/40 focus-visible:ring-0 bg-transparent font-serif italic leading-snug"
                            />
                            {/* No error display needed for optional subtitle usually, but could add if schema enforced */}
                        </div>

                        {/* Content Editor */}
                        <div className="prose prose-lg dark:prose-invert max-w-none min-h-[calc(100vh-300px)] prose-headings:font-bold prose-headings:font-serif prose-h1:text-4xl prose-h2:text-3xl prose-p:text-lg prose-p:leading-relaxed text-foreground">
                            <input type="hidden" name="content" value={content} />
                            <RichTextEditor content={content} onChange={setContent} />
                            {state?.errors?.content && (
                                <p className="text-sm text-red-500">{state.errors.content}</p>
                            )}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - WordPress style settings */}
                <aside className="w-80 border-l bg-card overflow-y-auto p-6 space-y-6 hidden lg:block">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Post Settings</h3>

                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-xs">URL Slug</Label>
                            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md border">
                                <Globe className="h-3 w-3 text-muted-foreground" />
                                <Input
                                    id="slug"
                                    name="slug"
                                    value={slug}
                                    onChange={(e) => {
                                        setSlug(e.target.value)
                                        setSlugTouched(true)
                                    }}
                                    className="h-6 text-xs border-none shadow-none focus-visible:ring-0 px-0 bg-transparent"
                                    placeholder="url-slug"
                                    required
                                />
                            </div>
                            {state?.errors?.slug && (
                                <p className="text-sm text-red-500">{state.errors.slug}</p>
                            )}
                        </div>

                        <div className="p-4 bg-muted/20 rounded-lg text-sm text-muted-foreground space-y-2">
                            <p>Status: <span className="font-medium text-foreground">{article?.status || 'Draft'}</span></p>
                            <p>Visibility: <span className="font-medium text-foreground">Public</span></p>
                        </div>

                        {/* Sidebar Featured Image */}
                        <div className="space-y-3 pt-4 border-t">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Featured Image</Label>

                            <input
                                type="file"
                                name="featuredImage"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <input type="hidden" name="isImageRemoved" value={!featuredImage ? 'true' : 'false'} />

                            {!featuredImage ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/5 hover:bg-muted/10"
                                >
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Upload Image</span>
                                </div>
                            ) : (
                                <div className="relative rounded-md overflow-hidden border bg-muted aspect-video group">
                                    <img
                                        src={featuredImage}
                                        alt="Featured"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={handleRemoveImage}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Categories & Tags */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Organization</h3>

                            <div className="space-y-2">
                                <Label htmlFor="categoryId" className="text-xs">Category</Label>
                                <select
                                    name="categoryId"
                                    id="categoryId"
                                    defaultValue={article?.categoryId || ""}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Uncategorized</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags" className="text-xs">Tags (comma separated)</Label>
                                <Input
                                    name="tags"
                                    id="tags"
                                    placeholder="logic, truth, debate"
                                    defaultValue={article?.tags?.map((t: any) => t.name).join(', ') || ""}
                                    className="text-sm"
                                />
                                <p className="text-[10px] text-muted-foreground">Separate tags with commas.</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Mobile Slug Input (visible only on small screens if side bar is hidden, for completeness) */}
            <div className="lg:hidden p-4 border-t">
                <Label htmlFor="slug-mobile" className="text-xs">URL Slug</Label>
                <Input
                    id="slug-mobile"
                    value={slug}
                    onChange={(e) => {
                        setSlug(e.target.value)
                        setSlugTouched(true)
                    }}
                    className="mt-1"
                />
            </div>
        </form>
    )
}
