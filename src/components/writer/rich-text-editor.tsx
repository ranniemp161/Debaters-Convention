'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Strikethrough } from 'lucide-react'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 overflow-auto',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    if (!editor) {
        return null
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-muted/20">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'bg-muted' : ''}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                >
                    <Quote className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}
