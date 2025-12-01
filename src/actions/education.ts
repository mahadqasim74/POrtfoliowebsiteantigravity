'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const EducationSchema = z.object({
    institution: z.string().min(1),
    degree: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
})

export async function createEducation(formData: FormData) {
    const data = EducationSchema.parse({
        institution: formData.get('institution'),
        degree: formData.get('degree'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
    })

    await prisma.education.create({
        data,
    })

    revalidatePath('/admin/education')
    revalidatePath('/')
}

export async function updateEducation(id: string, formData: FormData) {
    const data = EducationSchema.parse({
        institution: formData.get('institution'),
        degree: formData.get('degree'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
    })

    await prisma.education.update({
        where: { id },
        data,
    })

    revalidatePath('/admin/education')
    revalidatePath('/')
}

export async function deleteEducation(id: string) {
    await prisma.education.delete({
        where: { id },
    })

    revalidatePath('/admin/education')
    revalidatePath('/')
}
