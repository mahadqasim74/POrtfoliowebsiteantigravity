import { prisma } from '@/lib/db'
import { EducationList } from '@/components/admin/EducationList'

export default async function EducationPage() {
    const education = await prisma.education.findMany()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Education</h1>
                <p className="text-muted-foreground">Add or edit your educational background.</p>
            </div>

            <EducationList initialItems={education} />
        </div>
    )
}
