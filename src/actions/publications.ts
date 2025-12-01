'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

const PublicationSchema = z.object({
    title: z.string().min(1),
    link: z.string().min(1),
})

export async function createPublication(formData: FormData) {
    const data = PublicationSchema.parse({
        title: formData.get('title'),
        link: formData.get('link'),
    })

    const image = formData.get('image') as File
    let imageUrl = ''

    if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer())
        const filename = `${Date.now()}-${image.name.replace(/\s/g, '-')}`
        const uploadDir = path.join(process.cwd(), 'public/publications') // Assuming publications folder exists

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        fs.writeFileSync(path.join(uploadDir, filename), buffer)
        imageUrl = `/publications/${filename}`
    }

    const maxOrder = await prisma.publication.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
    })

    await prisma.publication.create({
        data: {
            ...data,
            imageUrl,
            order: (maxOrder?.order ?? 0) + 1,
        },
    })

    revalidatePath('/admin/publications')
    revalidatePath('/')
}

export async function deletePublication(id: string) {
    const pub = await prisma.publication.findUnique({ where: { id } })

    if (pub?.imageUrl) {
        const filePath = path.join(process.cwd(), 'public', pub.imageUrl)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }

    await prisma.publication.delete({
        where: { id },
    })

    revalidatePath('/admin/publications')
    revalidatePath('/')
}

export async function reorderPublications(items: { id: string; order: number }[]) {
    for (const item of items) {
        await prisma.publication.update({
            where: { id: item.id },
            data: { order: item.order },
        })
    }

    revalidatePath('/admin/publications')
    revalidatePath('/')
}
