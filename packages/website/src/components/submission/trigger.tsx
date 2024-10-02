'use client'

import { Button } from '@viaprize/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@viaprize/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@viaprize/ui/drawer'
import { Input } from '@viaprize/ui/input'
import { Label } from '@viaprize/ui/label'
import { Textarea } from '@viaprize/ui/textarea'
import { Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SubmissionDialog() {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const Content = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h3 className="text-lg font-semibold">Prize: $1000</h3>
      </div>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Submission Title</Label>
          <Input id="title" placeholder="Enter your submission title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Describe your submission" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="link">Project Link</Label>
          <Input
            id="link"
            type="url"
            placeholder="https://your-project-link.com"
          />
        </div>
        <Button type="submit" className="w-full">
          Submit Entry
        </Button>
      </form>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button>Submit Bounty Entry</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Submit Your Entry</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Submit Bounty Entry</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Your Entry</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  )
}
