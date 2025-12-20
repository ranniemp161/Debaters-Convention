import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Heart, Twitter, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#0F172A] text-white py-24">
                <div className="container mx-auto px-4 md:px-6 space-y-6">
                    <span className="bg-secondary text-secondary-foreground font-bold px-3 py-1.5 rounded-sm text-sm uppercase tracking-wider inline-block">
                        About Us
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl">
                        A Platform for <span className="text-[#D32F2F]">Thoughtful Discourse</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                        Debaters Convention was founded on the belief that meaningful dialogue across diverse perspectives leads to deeper understanding and growth.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">Our Mission</h2>
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                In an era of echo chambers and polarization, we provide a space where people can engage with ideas that challenge them, presented by those who genuinely hold different views.
                            </p>
                            <p>
                                Whether you're exploring questions of faith, wrestling with philosophical dilemmas, or navigating political debates, our platform offers well-reasoned perspectives from multiple angles.
                            </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-primary p-6 italic text-foreground/80">
                            "The best way to have a good idea is to have lots of ideas."
                            <br />
                            <span className="text-sm font-semibold mt-2 block not-italic text-primary">— Linus Pauling</span>
                        </div>
                    </div>

                    {/* Image Grid Placeholder */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-200 dark:bg-neutral-800 h-64 w-full rounded-lg col-span-2 flex items-center justify-center text-muted-foreground">
                            Library / Books Image
                        </div>
                        <div className="bg-neutral-200 dark:bg-neutral-800 h-48 w-full rounded-lg flex items-center justify-center text-muted-foreground">
                            Architecture Image
                        </div>
                        <div className="bg-neutral-200 dark:bg-neutral-800 h-48 w-full rounded-lg flex items-center justify-center text-muted-foreground">
                            Discussion Image
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4 md:px-6 space-y-16">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">Our Core Values</h2>
                        <p className="text-muted-foreground text-lg">The principles that guide everything we do</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Diverse Perspectives",
                                desc: "We celebrate the richness that comes from different viewpoints and encourage open-minded dialogue."
                            },
                            {
                                icon: Target,
                                title: "Intellectual Rigor",
                                desc: "We strive for depth and accuracy in our discussions, grounded in careful thought and research."
                            },
                            {
                                icon: Heart,
                                title: "Respectful Engagement",
                                desc: "We maintain civility and respect, even when disagreeing on fundamental issues."
                            }
                        ].map((value, i) => (
                            <Card key={i} className="border-none shadow-lg text-center p-8 space-y-4 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                                <div className="h-16 w-16 bg-[#D32F2F] text-white rounded flex items-center justify-center mb-4">
                                    <value.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">{value.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {value.desc}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Editorial Team */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 md:px-6 space-y-16">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">Our Editorial Team</h2>
                        <p className="text-muted-foreground text-lg">Experienced thinkers dedicated to quality content</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        {[
                            { name: "Sarah Johnson", role: "Theology Editor", focus: "Systematic Theology" },
                            { name: "Michael Chen", role: "Philosophy Editor", focus: "Ethics & Metaphysics" },
                            { name: "Emma Davis", role: "Politics Editor", focus: "Political Philosophy" },
                        ].map((member, i) => (
                            <div key={i} className="flex flex-col items-center space-y-4">
                                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-4xl font-bold">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-[#D32F2F] font-medium text-sm mt-1">{member.role}</p>
                                    <p className="text-muted-foreground text-sm mt-1">{member.focus}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-[#D32F2F] text-white py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-white/20">
                        {[
                            { label: "Articles Published", value: "500+" },
                            { label: "Contributing Writers", value: "50+" },
                            { label: "Monthly Readers", value: "10k+" },
                            { label: "Topic Areas", value: "15+" },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="text-4xl md:text-5xl font-extrabold">{stat.value}</div>
                                <div className="text-white/80 text-sm uppercase tracking-wide font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
