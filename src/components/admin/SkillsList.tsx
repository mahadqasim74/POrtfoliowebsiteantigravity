'use client'

import { useState } from 'react'
import { Skill, SkillCategory } from '@prisma/client'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GripVertical, Trash2, Plus, X } from 'lucide-react'
import { createSkillCategory, deleteSkillCategory, createSkill, deleteSkill, reorderSkills } from '@/actions/skills'
import { toast } from 'sonner'

interface SkillsListProps {
    categories: (SkillCategory & { skills: Skill[] })[]
}

export function SkillsList({ categories }: SkillsListProps) {
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
    const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

    async function handleCreateCategory(formData: FormData) {
        try {
            await createSkillCategory(formData)
            toast.success('Category created')
            setIsCategoryDialogOpen(false)
        } catch (error) {
            toast.error('Failed to create category')
        }
    }

    async function handleDeleteCategory(id: string) {
        if (confirm('Delete this category and all its skills?')) {
            try {
                await deleteSkillCategory(id)
                toast.success('Category deleted')
            } catch (error) {
                toast.error('Failed to delete category')
            }
        }
    }

    async function handleCreateSkill(formData: FormData) {
        try {
            await createSkill(formData)
            toast.success('Skill added')
            setIsSkillDialogOpen(false)
        } catch (error) {
            toast.error('Failed to add skill')
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Skills</h2>
                <Button onClick={() => setIsCategoryDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
            </div>

            <div className="grid gap-6">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onDelete={() => handleDeleteCategory(category.id)}
                        onAddSkill={() => {
                            setSelectedCategoryId(category.id)
                            setIsSkillDialogOpen(true)
                        }}
                    />
                ))}
            </div>

            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>
                    <form action={handleCreateCategory} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input id="name" name="name" required />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Skill</DialogTitle>
                    </DialogHeader>
                    <form action={handleCreateSkill} className="space-y-4">
                        <input type="hidden" name="categoryId" value={selectedCategoryId || ''} />
                        <div className="space-y-2">
                            <Label htmlFor="skillName">Skill Name</Label>
                            <Input id="skillName" name="name" required />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsSkillDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function CategoryCard({ category, onDelete, onAddSkill }: { category: SkillCategory & { skills: Skill[] }, onDelete: () => void, onAddSkill: () => void }) {
    const [skills, setSkills] = useState(category.skills)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setSkills((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)
                const newItems = arrayMove(items, oldIndex, newIndex)

                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    order: index + 1,
                }))
                reorderSkills(updates)

                return newItems
            })
        }
    }

    async function handleDeleteSkill(id: string) {
        try {
            await deleteSkill(id)
            setSkills(skills.filter(s => s.id !== id))
            toast.success('Skill deleted')
        } catch (error) {
            toast.error('Failed to delete skill')
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onAddSkill}>
                        <Plus className="w-4 h-4 mr-2" /> Add Skill
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={skills} strategy={rectSortingStrategy}>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <SortableSkill
                                    key={skill.id}
                                    skill={skill}
                                    onDelete={() => handleDeleteSkill(skill.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </CardContent>
        </Card>
    )
}

function SortableSkill({ skill, onDelete }: { skill: Skill, onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: skill.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="group relative inline-flex items-center">
            <div
                {...attributes}
                {...listeners}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm cursor-grab hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 pr-8"
            >
                {skill.name}
            </div>
            <button
                onClick={onDelete}
                className="absolute right-1 p-1 rounded-full hover:bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    )
}
