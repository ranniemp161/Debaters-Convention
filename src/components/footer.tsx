import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
    return (
        <footer className="bg-[#0F172A] text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="bg-primary text-white text-xs font-bold px-1 py-0.5 rounded">DC</span>
                            <span className="text-xl font-bold">Debaters Convention</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A platform fostering meaningful dialogue on theology, philosophy, politics, and beyond. Embracing diverse perspectives for deeper understanding.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                            </li>
                            <li>
                                <Link href="/articles" className="hover:text-primary transition-colors">Articles</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Connect</h3>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 hover:text-white text-gray-400">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 hover:text-white text-gray-400">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 hover:text-white text-gray-400">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 hover:text-white text-gray-400">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Newsletter (Optional in Footer, since it's also on page) */}
                    {/* Keeping it simple for now to match exactly the reference which just lists columns mostly */}
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Debaters Convention. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
