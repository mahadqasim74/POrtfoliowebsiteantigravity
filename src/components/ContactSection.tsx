import { prisma } from '@/lib/db'
import { Mail, Phone, Linkedin } from 'lucide-react'

export async function ContactSection() {
    const profile = await prisma.profile.findFirst()

    if (!profile) return null

    return (
        <section id="contact" className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Contact</h2>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                    <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-3 text-slate-300 hover:text-yellow-400 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                            <Mail className="w-6 h-6" />
                        </div>
                        <span className="text-lg">{profile.email}</span>
                    </a>

                    <a
                        href={`tel:${profile.phone}`}
                        className="flex items-center gap-3 text-slate-300 hover:text-yellow-400 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                            <Phone className="w-6 h-6" />
                        </div>
                        <span className="text-lg">{profile.phone}</span>
                    </a>

                    <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-slate-300 hover:text-yellow-400 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                            <Linkedin className="w-6 h-6" />
                        </div>
                        <span className="text-lg">LinkedIn</span>
                    </a>
                </div>
            </div>
        </section>
    )
}
