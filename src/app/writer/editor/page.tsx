
import { Editor } from "@/components/writer/editor"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function NewArticlePage() {
    const session = await auth()

    if (!session || !session.user || session.user.role !== 'WRITER') {
        redirect('/')
    }

    return <Editor />
}
