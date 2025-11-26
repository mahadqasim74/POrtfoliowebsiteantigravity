'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

const CertificationSchema = z.object({
    name: z.string().min(1),
    imageUrl: z.string().min(1),
})

export async function createCertification(formData: FormData) {
    const name = formData.get('name') as string
    const image = formData.get('image') as File

    let imageUrl = ''
    if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer())
        const filename = `${Date.now()}-${image.name.replace(/\s/g, '-')}`
        const uploadDir = path.join(process.cwd(), 'public/certifications')

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        fs.writeFileSync(path.join(uploadDir, filename), buffer)
        imageUrl = `/certifications/${filename}`
    }

    const maxOrder = await prisma.certification.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
    })

    await prisma.certification.create({
        data: {
            name,
            imageUrl,
            order: (maxOrder?.order ?? 0) + 1,
        },
    })

    revalidatePath('/admin/certifications')
    revalidatePath('/')
}

export async function deleteCertification(id: string) {
    const cert = await prisma.certification.findUnique({ where: { id } })

    if (cert?.imageUrl) {
        const filePath = path.join(process.cwd(), 'public', cert.imageUrl)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }

    await prisma.certification.delete({
        where: { id },
    })

    revalidatePath('/admin/certifications')
    revalidatePath('/')
}

export async function reorderCertifications(items: { id: string; order: number }[]) {
    for (const item of items) {
        await prisma.certification.update({
            where: { id: item.id },
            data: { order: item.order },
        })
    }

    revalidatePath('/admin/certifications')
    revalidatePath('/')
}
