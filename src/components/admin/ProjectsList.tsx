'use client'

import { useState } from 'react'
import { Project } from '@prisma/client'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GripVertical, Trash2, Plus } from 'lucide-react'
import { createProject, deleteProject, reorderProjects } from '@/actions/projects'
import { toast } from 'sonner'
import Image from 'next/image'

interface ProjectsListProps {
    initialItems: Project[]
}

export function ProjectsList({ initialItems }: ProjectsListProps) {
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
                reorderProjects(updates)

                return newItems
            })
        }
    }

    async function handleSubmit(formData: FormData) {
        try {
            await createProject(formData)
            toast.success('Project added')
            setIsDialogOpen(false)
        } catch (error) {
            toast.error('Failed to add project')
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id)
                toast.success('Project deleted')
            } catch (error) {
                toast.error('Failed to delete project')
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Projects</h2>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Project
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Project</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subtitle">Subtitle</Label>
                                <Input id="subtitle" name="subtitle" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link">Project Link</Label>
                            <Input id="link" name="link" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <Input id="image" name="image" type="file" accept="image/*" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (JSON List)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue='["Feature 1", "Feature 2"]'
                                rows={5}
                                required
                            />
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

function SortableItem({ item, onDelete }: { item: Project; onDelete: () => void }) {
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
                <div className="w-32 h-20 relative shrink-0 bg-slate-100 rounded overflow-hidden">
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
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
