import { prisma } from '@/lib/db'
import { ExperienceList } from '@/components/admin/ExperienceList'

export default async function ExperiencePage() {
    const experiences = await prisma.experience.findMany({
        orderBy: { order: 'asc' },
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Experience</h1>
                <p className="text-muted-foreground">Add, edit, or reorder your work experience.</p>
            </div>

            <ExperienceList initialItems={experiences} />
        </div>
    )
}
