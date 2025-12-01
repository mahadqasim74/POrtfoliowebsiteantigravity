'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ExperienceSchema = z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    description: z.string(), // JSON string
})

export async function createExperience(formData: FormData) {
    const data = ExperienceSchema.parse({
        company: formData.get('company'),
        role: formData.get('role'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        description: formData.get('description'),
    })

    const maxOrder = await prisma.experience.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
    })

    await prisma.experience.create({
        data: {
            ...data,
            order: (maxOrder?.order ?? 0) + 1,
        },
    })

    revalidatePath('/admin/experience')
    revalidatePath('/')
}

export async function updateExperience(id: string, formData: FormData) {
    const data = ExperienceSchema.parse({
        company: formData.get('company'),
        role: formData.get('role'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        description: formData.get('description'),
    })

    await prisma.experience.update({
        where: { id },
        data,
    })

    revalidatePath('/admin/experience')
    revalidatePath('/')
}

export async function deleteExperience(id: string) {
    await prisma.experience.delete({
        where: { id },
    })

    revalidatePath('/admin/experience')
    revalidatePath('/')
}

export async function reorderExperience(items: { id: string; order: number }[]) {
    for (const item of items) {
        await prisma.experience.update({
            where: { id: item.id },
            data: { order: item.order },
        })
    }

    revalidatePath('/admin/experience')
    revalidatePath('/')
}
