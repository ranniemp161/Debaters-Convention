import Link from "next/link"
import { Globe, Rss, AudioLines, Sun } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#050505] text-gray-300 pt-20 pb-10 border-t border-white/5 font-sans">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            {/* Icon Placeholder */}
                            <div className="text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-quote h-6 w-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 12a2 2 0 0 0 2-2V8" /><path d="M16 8v2a2 2 0 0 0 2 2" /></svg>
                            </div>
                            <span className="text-white text-lg font-bold italic tracking-tight font-serif group-hover:text-white/90 transition-colors">Debaters Convention</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-light">
                            Cultivating wisdom through clash of minds. The internet's premier destination for serious intellectual discourse.
                        </p>
                        <div className="flex gap-5 pt-4">
                            <Link href="#" className="text-gray-600 hover:text-white transition-colors">
                                <Globe className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-white transition-colors">
                                <AudioLines className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-white transition-colors">
                                <Rss className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Platform */}
                    <div className="space-y-6">
                        <h3 className="text-white/90 text-xs font-bold uppercase tracking-widest">Platform</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-white transition-colors">Trending Debates</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Video Archives</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Submit an Essay</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Leaderboard</Link></li>
                        </ul>
                    </div>

                    {/* Topics */}
                    <div className="space-y-6">
                        <h3 className="text-white/90 text-xs font-bold uppercase tracking-widest">Topics</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="/articles?topic=philosophy" className="hover:text-white transition-colors">Philosophy</Link></li>
                            <li><Link href="/articles?topic=theology" className="hover:text-white transition-colors">Theology</Link></li>
                            <li><Link href="/articles?topic=politics" className="hover:text-white transition-colors">Politics</Link></li>
                            <li><Link href="/articles?topic=science" className="hover:text-white transition-colors">Science & Ethics</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-6">
                        <h3 className="text-white/90 text-xs font-bold uppercase tracking-widest">Support</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-white transition-colors">Community Guidelines</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>&copy; {new Date().getFullYear()} Debaters Convention. All rights reserved.</p>

                    <div className="flex items-center gap-6">
                        <span className="hover:text-gray-400 cursor-pointer">English (US)</span>
                        <div className="flex items-center gap-2 hover:text-gray-400 cursor-pointer group">
                            <Sun className="h-3 w-3 group-hover:animate-spin-slow" />
                            <span>Light Mode</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
