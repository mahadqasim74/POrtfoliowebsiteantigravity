'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const SkillCategorySchema = z.object({
    name: z.string().min(1),
})

const SkillSchema = z.object({
    name: z.string().min(1),
    categoryId: z.string().min(1),
})

export async function createSkillCategory(formData: FormData) {
    const data = SkillCategorySchema.parse({
        name: formData.get('name'),
    })

    const maxOrder = await prisma.skillCategory.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
    })

    await prisma.skillCategory.create({
        data: {
            ...data,
            order: (maxOrder?.order ?? 0) + 1,
        },
    })

    revalidatePath('/admin/skills')
    revalidatePath('/')
}

export async function deleteSkillCategory(id: string) {
    // Delete all skills in this category first
    await prisma.skill.deleteMany({
        where: { categoryId: id },
    })

    await prisma.skillCategory.delete({
        where: { id },
    })

    revalidatePath('/admin/skills')
    revalidatePath('/')
}

export async function createSkill(formData: FormData) {
    const data = SkillSchema.parse({
        name: formData.get('name'),
        categoryId: formData.get('categoryId'),
    })

    const maxOrder = await prisma.skill.findFirst({
        where: { categoryId: data.categoryId },
        orderBy: { order: 'desc' },
        select: { order: true },
    })

    await prisma.skill.create({
        data: {
            ...data,
            order: (maxOrder?.order ?? 0) + 1,
        },
    })

    revalidatePath('/admin/skills')
    revalidatePath('/')
}

export async function deleteSkill(id: string) {
    await prisma.skill.delete({
        where: { id },
    })

    revalidatePath('/admin/skills')
    revalidatePath('/')
}

export async function reorderSkillCategories(items: { id: string; order: number }[]) {
    for (const item of items) {
        await prisma.skillCategory.update({
            where: { id: item.id },
            data: { order: item.order },
        })
    }

    revalidatePath('/admin/skills')
    revalidatePath('/')
}

export async function reorderSkills(items: { id: string; order: number }[]) {
    for (const item of items) {
        await prisma.skill.update({
            where: { id: item.id },
            data: { order: item.order },
        })
    }

    revalidatePath('/admin/skills')
    revalidatePath('/')
}
