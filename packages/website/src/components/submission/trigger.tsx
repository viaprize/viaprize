'use client'

import { useAuth } from '@/hooks/useAuth'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@viaprize/ui/form'
import { Input } from '@viaprize/ui/input'
import { Label } from '@viaprize/ui/label'
import { Textarea } from '@viaprize/ui/textarea'
import { Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
const formSchema = z.object({
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  link: z.string().optional(),
})
export default function SubmissionDialog({
  totalFunds,
  prizeId,
}: {
  prizeId: string
  totalFunds: number
}) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  })
  const addSubmission = api.prizes.addSubmission.useMutation()
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    await addSubmission.mutateAsync({
      prizeId,
      submissionText: values.description,
    })
    router.refresh()
  }

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])
  const { session } = useAuth()

  const Content = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h3 className="text-lg font-semibold">Prize: ${totalFunds}</h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Label>
            Your wallet Id for receiving is {session?.user.wallet?.address}
          </Label>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    {...field}
                    placeholder="Describe your submission"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Project Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={addSubmission.isPending}
          >
            Submit Entry
          </Button>
        </form>
      </Form>
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
