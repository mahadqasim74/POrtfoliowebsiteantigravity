'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-react'
import { triggerDeployment } from '@/actions/deploy'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function DeployButton() {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    async function handleDeploy() {
        setIsLoading(true)
        try {
            await triggerDeployment()
            toast.success('Deployment triggered successfully!')
            setIsOpen(false)
        } catch (error) {
            toast.error('Failed to trigger deployment. Check configuration.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy Changes
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Deploy to Production</DialogTitle>
                    <DialogDescription>
                        This will trigger a new build and deployment of your website. Are you sure you want to proceed?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeploy} disabled={isLoading}>
                        {isLoading ? 'Deploying...' : 'Confirm Deploy'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
