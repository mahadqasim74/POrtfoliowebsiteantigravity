'use client'

import { useState } from 'react'
import { Experience } from '@prisma/client'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-react'
import { createExperience, updateExperience, deleteExperience, reorderExperience } from '@/actions/experience'
import { toast } from 'sonner'

interface ExperienceListProps {
    initialItems: Experience[]
}

export function ExperienceList({ initialItems }: ExperienceListProps) {
    const [items, setItems] = useState(initialItems)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Experience | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)
                const newItems = arrayMove(items, oldIndex, newIndex)

                // Update order in DB
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    order: index + 1,
                }))
                reorderExperience(updates)

                return newItems
            })
        }
    }

    async function handleSubmit(formData: FormData) {
        try {
            if (editingItem) {
                await updateExperience(editingItem.id, formData)
                toast.success('Experience updated')
            } else {
                await createExperience(formData)
                toast.success('Experience created')
            }
            setIsDialogOpen(false)
            setEditingItem(null)
        } catch (error) {
            toast.error('Failed to save experience')
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteExperience(id)
                toast.success('Experience deleted')
            } catch (error) {
                toast.error('Failed to delete experience')
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Experience</h2>
                <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true) }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                item={item}
                                onEdit={() => { setEditingItem(item); setIsDialogOpen(true) }}
                                onDelete={() => handleDelete(item.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input id="company" name="company" defaultValue={editingItem?.company} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" name="role" defaultValue={editingItem?.role} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" name="startDate" defaultValue={editingItem?.startDate || ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" name="endDate" defaultValue={editingItem?.endDate || ''} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (JSON List)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={editingItem?.description || '["Responsibility 1", "Responsibility 2"]'}
                                rows={5}
                                required
                            />
                            <p className="text-xs text-muted-foreground">Format: ["Item 1", "Item 2"]</p>
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

function SortableItem({ item, onEdit, onDelete }: { item: Experience; onEdit: () => void; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Card ref={setNodeRef} style={style} className="bg-white dark:bg-slate-800">
            <CardContent className="p-4 flex items-center gap-4">
                <div {...attributes} {...listeners} className="cursor-grab hover:text-slate-600">
                    <GripVertical className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold">{item.role}</h3>
                    <p className="text-sm text-muted-foreground">{item.company} | {item.startDate} - {item.endDate}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={onEdit}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
