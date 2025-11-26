'use client'

import { useState } from 'react'
import { Publication } from '@prisma/client'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GripVertical, Trash2, Plus, ExternalLink } from 'lucide-react'
import { createPublication, deletePublication, reorderPublications } from '@/actions/publications'
import { toast } from 'sonner'
import Image from 'next/image'

interface PublicationsListProps {
    initialItems: Publication[]
}

export function PublicationsList({ initialItems }: PublicationsListProps) {
    const [items, setItems] = useState(initialItems)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

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

                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    order: index + 1,
                }))
                reorderPublications(updates)

                return newItems
            })
        }
    }

    async function handleSubmit(formData: FormData) {
        try {
            await createPublication(formData)
            toast.success('Publication added')
            setIsDialogOpen(false)
        } catch (error) {
            toast.error('Failed to add publication')
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this publication?')) {
            try {
                await deletePublication(id)
                toast.success('Publication deleted')
            } catch (error) {
                toast.error('Failed to delete publication')
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Publications</h2>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Publication
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                item={item}
                                onDelete={() => handleDelete(item.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Publication</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link">Link</Label>
                            <Input id="link" name="link" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <Input id="image" name="image" type="file" accept="image/*" required />
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

function SortableItem({ item, onDelete }: { item: Publication; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Card ref={setNodeRef} style={style} className="bg-white dark:bg-slate-800">
            <CardContent className="p-4 flex gap-4">
                <div {...attributes} {...listeners} className="cursor-grab hover:text-slate-600 flex items-center">
                    <GripVertical className="w-5 h-5 text-slate-400" />
                </div>
                <div className="w-20 h-20 relative shrink-0 bg-white rounded overflow-hidden p-1 border border-slate-200">
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold">{item.title}</h3>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                        View Publication <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
