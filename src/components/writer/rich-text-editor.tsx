'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
// Import local menu components to avoid versioning/export issues
import { BubbleMenu } from './tiptap-menu/bubble-menu'
import { FloatingMenu } from './tiptap-menu/floating-menu'
import { Button } from '@/components/ui/button'
import {
    Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Image as ImageIcon, Link as LinkIcon, Plus
} from 'lucide-react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { uploadEditorImage } from '@/lib/article-actions'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isMounted, setIsMounted] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({
                placeholder: 'Tell your story...',
            }),
            BubbleMenuExtension,
            FloatingMenuExtension,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'min-h-[300px] w-full rounded-md bg-transparent px-0 py-2 text-lg focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto prose prose-lg dark:prose-invert max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    const addImage = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && editor) {
            const formData = new FormData()
            formData.append('file', file)

            // Optimistic update or loading state could be added here
            const result = await uploadEditorImage(formData)

            if (result && 'url' in result && result.url) {
                editor.chain().focus().setImage({ src: result.url }).run()
            } else {
                alert(`Upload Failed: ${result?.error || "Unknown error"}`)
            }

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="relative">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            {/* Bubble Menu - appears on text selection */}
            {editor && isMounted && (
                <BubbleMenu className="flex items-center gap-1 rounded-md border bg-background shadow-md p-1" tippyOptions={{ duration: 100 }} editor={editor}>
                    <Button
                        variant="ghost" size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'bg-muted' : ''}
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost" size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'bg-muted' : ''}
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost" size="sm"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'bg-muted' : ''}
                    >
                        <Strikethrough className="h-4 w-4" />
                    </Button>
                </BubbleMenu>
            )}

            {/* Floating Menu - appears on new line */}
            {editor && isMounted && (
                <FloatingMenu
                    className="flex items-center gap-1 bg-transparent py-1 pr-1"
                    tippyOptions={{ duration: 100, placement: 'right' }}
                    editor={editor}
                >
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`h-8 w-8 rounded-full border-muted-foreground/30 transition-transform ${isMenuOpen ? 'rotate-45' : ''}`}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>

                        {isMenuOpen && (
                            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-5 duration-200">
                                <Button
                                    variant="ghost" size="sm"
                                    onClick={() => {
                                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                                        setIsMenuOpen(false)
                                    }}
                                    className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                                    title="Heading 1"
                                >
                                    <Heading1 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost" size="sm"
                                    onClick={() => {
                                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                                        setIsMenuOpen(false)
                                    }}
                                    className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                                    title="Heading 2"
                                >
                                    <Heading2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost" size="sm"
                                    onClick={() => {
                                        editor.chain().focus().toggleBulletList().run()
                                        setIsMenuOpen(false)
                                    }}
                                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                                    title="Bullet List"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost" size="sm"
                                    onClick={addImage}
                                    className="text-blue-500"
                                    title="Add Image"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost" size="sm"
                                    onClick={() => {
                                        editor.chain().focus().toggleBlockquote().run()
                                        setIsMenuOpen(false)
                                    }}
                                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                                    title="Quote"
                                >
                                    <Quote className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </FloatingMenu>
            )}

            <EditorContent editor={editor} />

            {/* Custom CSS for Tiptap placeholder */}
            <style jsx global>{`
                .tiptap p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    )
}
