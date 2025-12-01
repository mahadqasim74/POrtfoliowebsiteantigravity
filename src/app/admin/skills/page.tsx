import { prisma } from '@/lib/db'
import { SkillsList } from '@/components/admin/SkillsList'

export default async function SkillsPage() {
    const categories = await prisma.skillCategory.findMany({
        include: {
            skills: {
                orderBy: { order: 'asc' },
            },
        },
        orderBy: { order: 'asc' },
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Skills</h1>
                <p className="text-muted-foreground">Organize your skills into categories.</p>
            </div>

            <SkillsList categories={categories} />
        </div>
    )
}
