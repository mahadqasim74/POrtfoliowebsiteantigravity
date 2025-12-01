'use client'

import { useState } from 'react'
import { Education } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, Plus, GraduationCap } from 'lucide-react'
import { createEducation, updateEducation, deleteEducation } from '@/actions/education'
import { toast } from 'sonner'

interface EducationListProps {
    initialItems: Education[]
}

export function EducationList({ initialItems }: EducationListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Education | null>(null)

    async function handleSubmit(formData: FormData) {
        try {
            if (editingItem) {
                await updateEducation(editingItem.id, formData)
                toast.success('Education updated')
            } else {
                await createEducation(formData)
                toast.success('Education added')
            }
            setIsDialogOpen(false)
            setEditingItem(null)
        } catch (error) {
            toast.error('Failed to save education')
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteEducation(id)
                toast.success('Education deleted')
            } catch (error) {
                toast.error('Failed to delete education')
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Education</h2>
                <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true) }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
            </div>

            <div className="grid gap-4">
                {initialItems.map((item) => (
                    <Card key={item.id} className="bg-white dark:bg-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">{item.degree}</h3>
                                <p className="text-sm text-muted-foreground">{item.institution}</p>
                                {(item.startDate || item.endDate) && (
                                    <p className="text-xs text-slate-400 mt-1">{item.startDate} - {item.endDate}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsDialogOpen(true) }}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Education' : 'Add Education'}</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="institution">Institution</Label>
                            <Input id="institution" name="institution" defaultValue={editingItem?.institution} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="degree">Degree</Label>
                            <Input id="degree" name="degree" defaultValue={editingItem?.degree} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" name="startDate" defaultValue={editingItem?.startDate || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" name="endDate" defaultValue={editingItem?.endDate || ''} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
