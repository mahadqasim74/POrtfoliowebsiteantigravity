'use client'

import { useState } from 'react'
import { Certification } from '@prisma/client'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus } from 'lucide-react'
import { createCertification, deleteCertification, reorderCertifications } from '@/actions/certifications'
import { toast } from 'sonner'
import Image from 'next/image'

interface CertificationsListProps {
    initialItems: Certification[]
}

export function CertificationsList({ initialItems }: CertificationsListProps) {
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
                reorderCertifications(updates)

                return newItems
            })
        }
    }

    async function handleSubmit(formData: FormData) {
        try {
            await createCertification(formData)
            toast.success('Certification added')
            setIsDialogOpen(false)
        } catch (error) {
            toast.error('Failed to add certification')
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this certification?')) {
            try {
                await deleteCertification(id)
                toast.success('Certification deleted')
            } catch (error) {
                toast.error('Failed to delete certification')
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Certifications</h2>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Certification
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        <DialogTitle>Add Certification</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" required />
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

function SortableItem({ item, onDelete }: { item: Certification; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Card ref={setNodeRef} style={style} className="bg-white dark:bg-slate-800 group relative">
            <CardContent className="p-4 flex flex-col items-center gap-2">
                <div {...attributes} {...listeners} className="cursor-grab w-full aspect-square relative bg-white rounded-md overflow-hidden p-2 border border-slate-200">
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain"
                    />
                </div>
                <p className="text-center text-sm font-medium truncate w-full">{item.name}</p>

                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardContent>
        </Card>
    )
}
