import { prisma } from '@/lib/db'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

export async function PublicationsSection() {
    const publications = await prisma.publication.findMany({
        orderBy: { order: 'asc' },
    })

    return (
        <section id="publications" className="py-20 bg-slate-800 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Publications</h2>

                <div className="max-w-3xl mx-auto">
                    {publications.map((pub) => (
                        <div key={pub.id} className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg hover:border-yellow-400 transition-colors group">
                            <div className="flex items-center gap-6">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-slate-200 mb-4 group-hover:text-white transition-colors">
                                        {pub.title}
                                    </h3>
                                    <a
                                        href={pub.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                                    >
                                        Read Publication <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                                <div className="w-24 h-24 shrink-0 relative bg-white rounded-lg overflow-hidden p-2">
                                    <Image
                                        src={pub.imageUrl}
                                        alt="Publication"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
