'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

const ProfileSchema = z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    bio: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    linkedin: z.string().url(),
    whatsapp: z.string().url(),
})

export async function updateProfile(formData: FormData) {
    const data = ProfileSchema.parse({
        name: formData.get('name'),
        title: formData.get('title'),
        bio: formData.get('bio'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        linkedin: formData.get('linkedin'),
        whatsapp: formData.get('whatsapp'),
    })

    const image = formData.get('image') as File
    let imageUrl = undefined

    if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer())
        const filename = `profile-${Date.now()}.jpg`
        const uploadDir = path.join(process.cwd(), 'public')

        fs.writeFileSync(path.join(uploadDir, filename), buffer)
        imageUrl = `/${filename}`
    }

    const profile = await prisma.profile.findFirst()

    if (profile) {
        await prisma.profile.update({
            where: { id: profile.id },
            data: {
                ...data,
                ...(imageUrl && { imageUrl }),
            },
        })
    } else {
        await prisma.profile.create({
            data: {
                ...data,
                imageUrl: imageUrl || '/profile.jpg',
            },
        })
    }

    revalidatePath('/')
    revalidatePath('/admin/profile')
}
