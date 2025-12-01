import { prisma } from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Linkedin, Phone } from 'lucide-react'

export async function HeroSection() {
    const profile = await prisma.profile.findFirst()

    if (!profile) return null

    return (
        <header id="hero" className="bg-slate-900 text-white py-20">
            <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
                <div className="flex-1 space-y-6">
                    <h1 className="text-5xl font-bold animate-fade-up">
                        {profile.name} <span className="text-yellow-400">PMP®</span>
                    </h1>
                    <div className="flex gap-2 animate-fade-up delay-100">
                        <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">NABCEP®</span>
                    </div>
                    <p className="text-xl text-slate-300 animate-fade-up delay-100">{profile.title}</p>

                    <div className="flex gap-4 animate-fade-up delay-200">
                        <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                            <Phone className="w-6 h-6" />
                        </a>
                        <a href={`mailto:${profile.email}`} className="hover:text-red-400 transition-colors">
                            <Mail className="w-6 h-6" />
                        </a>
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                            <Linkedin className="w-6 h-6" />
                        </a>
                    </div>

                    <div className="flex gap-4 animate-fade-up delay-300 pt-4">
                        <Link href="#experience" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition-colors">
                            View Experience
                        </Link>
                        <a
                            href="https://calendly.com/mahadqasim/30-min-slot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-white hover:bg-white hover:text-slate-900 font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            Schedule Meeting
                        </a>
                    </div>
                </div>

                <div className="relative w-64 h-64 md:w-80 md:h-80 animate-fade-up delay-200">
                    <Image
                        src={profile.imageUrl}
                        alt={profile.name}
                        fill
                        className="object-cover rounded-full border-4 border-yellow-400 shadow-2xl"
                        priority
                    />
                    {/* Bubbles could be added here as absolute positioned elements if needed */}
                </div>
            </div>
        </header>
    )
}
