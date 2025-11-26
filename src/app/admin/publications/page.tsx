import { prisma } from '@/lib/db'
import { PublicationsList } from '@/components/admin/PublicationsList'

export default async function PublicationsPage() {
    const publications = await prisma.publication.findMany({
        orderBy: { order: 'asc' },
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Publications</h1>
                <p className="text-muted-foreground">Add, edit, or reorder your publications.</p>
            </div>

            <PublicationsList initialItems={publications} />
        </div>
    )
}
