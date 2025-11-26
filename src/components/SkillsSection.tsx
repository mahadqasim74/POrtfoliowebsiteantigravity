import { prisma } from '@/lib/db'

export async function SkillsSection() {
    const skillCategories = await prisma.skillCategory.findMany({
        include: {
            skills: {
                orderBy: { order: 'asc' },
            },
        },
        orderBy: { order: 'asc' },
    })

    return (
        <section id="skills" className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Skills</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {skillCategories.map((category) => (
                        <div key={category.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-xl font-semibold mb-6 text-yellow-400 border-b border-slate-700 pb-2">
                                {category.name}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-full text-sm transition-colors cursor-default"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
