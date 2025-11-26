'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

const ProjectSchema = z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    description: z.string(), // JSON string
    link: z.string().optional(),
})

export async function createProject(formData: FormData) {
    const data = ProjectSchema.parse({
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        description: formData.get('description'),
        link: formData.get('link'),
    })

    const image = formData.get('image') as File
    let imageUrl = ''

    if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer())
        const filename = `${Date.now()}-${image.name.replace(/\s/g, '-')}`
        const uploadDir = path.join(process.cwd(), 'public/projects') // Assuming projects folder exists or will be created

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        fs.writeFileSync(path.join(uploadDir, filename), buffer)
        imageUrl = `/projects/${filename}`
    }

    const maxOrder = await prisma.project.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
    })

    await prisma.project.create({
        data: {
            ...data,
            imageUrl,
            order: (maxOrder?.order ?? 0) + 1,
        },
    })

    revalidatePath('/admin/projects')
    revalidatePath('/')
}

export async function deleteProject(id: string) {
    const project = await prisma.project.findUnique({ where: { id } })

    if (project?.imageUrl) {
        const filePath = path.join(process.cwd(), 'public', project.imageUrl)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }

    await prisma.project.delete({
        where: { id },
    })

    revalidatePath('/admin/projects')
    revalidatePath('/')
}

export async function reorderProjects(items: { id: string; order: number }[]) {
    for (const item of items) {
        await prisma.project.update({
            where: { id: item.id },
            data: { order: item.order },
        })
    }

    revalidatePath('/admin/projects')
    revalidatePath('/')
}
