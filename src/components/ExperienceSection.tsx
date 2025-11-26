import { prisma } from '@/lib/db'

export async function ExperienceSection() {
    const experiences = await prisma.experience.findMany({
        orderBy: { order: 'asc' },
    })

    return (
        <section id="experience" className="py-20 bg-slate-800 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Work Experience</h2>

                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {experiences.map((exp, index) => {
                        const descriptions = JSON.parse(exp.description) as string[]
                        return (
                            <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-lg">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-yellow-400">{exp.role}</h3>
                                            <span className="text-slate-300 text-sm">{exp.company}</span>
                                        </div>
                                        <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded mt-2 sm:mt-0">
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-2 text-slate-300 text-sm">
                                        {descriptions.map((desc, i) => (
                                            <li key={i}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
