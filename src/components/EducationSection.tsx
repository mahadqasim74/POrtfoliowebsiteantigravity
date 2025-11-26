import { prisma } from '@/lib/db'

export async function EducationSection() {
    const education = await prisma.education.findMany()

    return (
        <section id="education" className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Education</h2>

                <div className="max-w-3xl mx-auto">
                    {education.map((edu) => (
                        <div key={edu.id} className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-lg">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-yellow-400">{edu.degree}</h3>
                                    <p className="text-slate-300 text-lg mt-1">{edu.institution}</p>
                                </div>
                                {edu.startDate && edu.endDate && (
                                    <span className="text-sm font-medium text-slate-400 bg-slate-900 px-3 py-1 rounded-full">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
