import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#0F172A] text-white py-20">
                <div className="container mx-auto px-4 md:px-6 text-center space-y-4">
                    <span className="bg-[#D32F2F] text-white font-bold px-3 py-1.5 rounded-sm text-sm uppercase tracking-wider inline-block">
                        Contact Us
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Get in Touch</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Have a question, suggestion, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">Contact Information</h2>
                            <p className="text-muted-foreground text-lg">
                                Reach out to us through any of these channels. We typically respond within 24-48 hours.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <Card className="border-l-4 border-l-[#D32F2F] shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full text-[#D32F2F]">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Email Us</h3>
                                        <p className="text-muted-foreground">hello@debatersconvention.com</p>
                                        <p className="text-muted-foreground">support@debatersconvention.com</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-[#D32F2F] shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full text-[#D32F2F]">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Visit Us</h3>
                                        <p className="text-muted-foreground">123 Debate Avenue, Suite 400</p>
                                        <p className="text-muted-foreground">New York, NY 10001</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-[#D32F2F] shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full text-[#D32F2F]">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Call Us</h3>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                        <p className="text-muted-foreground">Mon-Fri from 9am to 6pm EST</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-muted/30 p-8 rounded-2xl border">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Send us a Message</h2>
                                <p className="text-muted-foreground">Fill out the form below and we'll get back to you shortly.</p>
                            </div>

                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First name</Label>
                                        <Input id="first-name" placeholder="John" className="bg-background" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last name</Label>
                                        <Input id="last-name" placeholder="Doe" className="bg-background" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" placeholder="john@example.com" type="email" className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="How can we help?" className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="Type your message here..." className="min-h-[150px] bg-background" />
                                </div>
                                <Button className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold h-12 text-lg">
                                    Send Message <MessageSquare className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
