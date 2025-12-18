import Link from "next/link"
import { auth, signOut } from "@/auth"
import {
    LayoutDashboard,
    PenSquare,
    FileText,
    LogOut,
    ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"

export async function Sidebar() {
    const session = await auth()
    const role = session?.user?.role

    return (
        <div className="w-64 border-r bg-muted/40 min-h-screen flex flex-col">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>CMS Panel</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {role === 'ADMIN' && (
                    <>
                        <Button asChild variant="ghost" className="w-full justify-start gap-2">
                            <Link href="/admin">
                                <FileText className="h-4 w-4" />
                                Overview
                            </Link>
                        </Button>
                        {/* Add more admin links here if needed */}
                    </>
                )}

                {role === 'WRITER' && (
                    <>
                        <Button asChild variant="ghost" className="w-full justify-start gap-2">
                            <Link href="/writer">
                                <FileText className="h-4 w-4" />
                                My Articles
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start gap-2">
                            <Link href="/writer/submit">
                                <PenSquare className="h-4 w-4" />
                                Write New
                            </Link>
                        </Button>
                    </>
                )}
            </nav>

            <div className="p-4 border-t space-y-2">
                <Button asChild variant="outline" className="w-full justify-start gap-2">
                    <Link href="/">
                        <ExternalLink className="h-4 w-4" />
                        View Site
                    </Link>
                </Button>

                <form action={async () => {
                    'use server'
                    await signOut()
                }}>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    )
}
