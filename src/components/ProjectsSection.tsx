import { prisma } from '@/lib/db'
import Image from 'next/image'

export async function ProjectsSection() {
    const projects = await prisma.project.findMany({
        orderBy: { order: 'asc' },
    })

    return (
        <section id="projects" className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>

                <div className="space-y-12">
                    {projects.map((project) => {
                        const descriptions = JSON.parse(project.description) as string[]
                        return (
                            <div key={project.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row gap-8 items-center">
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-yellow-400">{project.title}</h3>
                                                {project.subtitle && (
                                                    <p className="text-slate-400 font-medium">{project.subtitle}</p>
                                                )}
                                            </div>

                                            <ul className="list-disc list-outside ml-4 space-y-2 text-slate-300">
                                                {descriptions.map((desc, i) => (
                                                    <li key={i}>{desc}</li>
                                                ))}
                                            </ul>

                                            {project.link && (
                                                <div className="pt-4">
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                                    >
                                                        View Project
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-full md:w-[300px] shrink-0">
                                            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                                                <Image
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
