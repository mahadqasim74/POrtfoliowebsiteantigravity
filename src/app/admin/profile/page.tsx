import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateProfile } from '@/actions/profile'
import { toast } from 'sonner'
import Image from 'next/image'

export default async function ProfilePage() {
    const profile = await prisma.profile.findFirst()

    async function handleSubmit(formData: FormData) {
        'use server'
        try {
            await updateProfile(formData)
        } catch (error) {
            console.error(error)
            // In a real app we'd handle error UI better
        }
    }

    if (!profile) return <div>Loading...</div>

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Profile</h1>
                <p className="text-muted-foreground">Update your personal information and profile picture.</p>
            </div>

            <form action={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700">
                        <Image
                            src={profile.imageUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="image">Profile Picture</Label>
                        <Input id="image" name="image" type="file" accept="image/*" />
                        <p className="text-xs text-muted-foreground">Recommended: Square image, at least 400x400px.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={profile.name} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input id="title" name="title" defaultValue={profile.title} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={profile.email} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" defaultValue={profile.phone} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input id="linkedin" name="linkedin" type="url" defaultValue={profile.linkedin} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp URL</Label>
                        <Input id="whatsapp" name="whatsapp" type="url" defaultValue={profile.whatsapp} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" defaultValue={profile.bio} rows={4} required />
                </div>

                <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </div>
    )
}
