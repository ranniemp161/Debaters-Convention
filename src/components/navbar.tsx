
import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut, User } from "lucide-react"

export async function Navbar() {
    const session = await auth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground text-xs px-1 rounded">DC</span>
                    Debaters Convention
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                        Home
                    </Link>
                    <Link href="/articles" className="text-sm font-medium transition-colors hover:text-primary">
                        Articles
                    </Link>
                    <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                        About
                    </Link>
                    <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <>
                            <div className="flex items-center gap-4">
                                <Button asChild variant="default" size="sm" className="hidden sm:flex">
                                    <Link href={session.user.role === 'ADMIN' ? '/admin' : '/writer'}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </Button>

                                <div className="h-6 w-px bg-border hidden sm:block"></div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium hidden md:inline-block">
                                        {session.user.username}
                                    </span>
                                    <form
                                        action={async () => {
                                            'use server'
                                            await signOut()
                                        }}
                                    >
                                        <Button variant="ghost" size="icon" title="Sign Out">
                                            <LogOut className="h-4 w-4 text-muted-foreground" />
                                            <span className="sr-only">Sign Out</span>
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Button asChild variant="outline" size="sm">
                            <Link href="/auth/signin">
                                <User className="mr-2 h-4 w-4" />
                                Login
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
