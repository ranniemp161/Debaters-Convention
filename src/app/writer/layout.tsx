
import { Sidebar } from "@/components/dashboard/sidebar"

export default function WriterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    )
}
