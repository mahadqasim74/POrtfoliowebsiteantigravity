import { prisma } from '@/lib/db'
import Image from 'next/image'

export async function CertificationsSection() {
    const certifications = await prisma.certification.findMany({
        orderBy: { order: 'asc' },
    })

    return (
        <section id="certifications" className="py-20 bg-slate-800 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Certifications</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="bg-slate-900 rounded-lg p-4 flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform duration-300 border border-slate-700 shadow-lg group">
                            <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden p-2">
                                <Image
                                    src={cert.imageUrl}
                                    alt={cert.name}
                                    fill
                                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <p className="text-center text-sm font-medium text-slate-300 group-hover:text-yellow-400 transition-colors">
                                {cert.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
