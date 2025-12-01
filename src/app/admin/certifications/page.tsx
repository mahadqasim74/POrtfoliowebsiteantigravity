import { prisma } from '@/lib/db'
import { CertificationsList } from '@/components/admin/CertificationsList'

export default async function CertificationsPage() {
    const certifications = await prisma.certification.findMany({
        orderBy: { order: 'asc' },
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Certifications</h1>
                <p className="text-muted-foreground">Upload and reorder your certifications.</p>
            </div>

            <CertificationsList initialItems={certifications} />
        </div>
    )
}
