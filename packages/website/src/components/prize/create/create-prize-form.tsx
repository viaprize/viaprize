'use client'

import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@viaprize/ui'
import { Button } from '@viaprize/ui/button'
import { Calendar } from '@viaprize/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@viaprize/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@viaprize/ui/form'
import { Input } from '@viaprize/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@viaprize/ui/popover'
import { Textarea } from '@viaprize/ui/textarea'
import { TimePicker } from '@viaprize/ui/time-picker'
import { differenceInMinutes, format, subDays } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z
  .object({
    image: z.instanceof(File).refine((file) => file.size <= 5000000, {
      message: 'Image must be less than 5MB',
    }),
    title: z.string().min(2, {
      message: 'Title must be at least 2 characters.',
    }),
    description: z.string().min(10, {
      message: 'Description must be at least 10 characters.',
    }),
    submissionStartDate: z.date({
      required_error: 'Submission start date is required.',
    }),
    submissionEndDate: z.date({
      required_error: 'Submission end date is required.',
    }),
    votingStartDate: z.date({
      required_error: 'Voting start date is required.',
    }),
    votingEndDate: z.date({
      required_error: 'Voting end date is required.',
    }),
  })
  .refine((data) => data.submissionEndDate > data.submissionStartDate, {
    message: 'Submission end date must be after start date',
    path: ['submissionEndDate'],
  })
  .refine((data) => data.votingEndDate > data.votingStartDate, {
    message: 'Voting end date must be after start date',
    path: ['votingEndDate'],
  })

interface CreatePrizeFormProps {
  imageUploadUrl: string
}

export default function Component({ imageUploadUrl }: CreatePrizeFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const mutation = api.prizes.createPrize.useMutation({
    onSuccess() {
      console.log('Success')
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('hiiiiiiiiiii')
    const image = await fetch(imageUploadUrl, {
      body: values.image,
      method: 'PUT',
      headers: {
        'Content-Type': values.image.type,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(
          values.image.name,
        )}"`,
        'Access-Control-Allow-Origin': '*',
      },
    })
    if (!image.ok) {
      form.setError('image', { message: 'Failed to upload image' })
      return
    }
    const extractedUrl = `${new URL(imageUploadUrl).origin}${
      new URL(imageUploadUrl).pathname
    }`
    // await mutation.mutateAsync({
    //   title: values.title,
    //   description: values.description,
    //   submissionStartDate: values.submissionStartDate.toISOString(),
    //   submissionDuration: differenceInMinutes(
    //     values.submissionEndDate,
    //     values.submissionStartDate,
    //   ),
    //   votingStartDate: values.votingStartDate.toISOString(),
    //   votingDuration: differenceInMinutes(
    //     values.votingEndDate,
    //     values.votingStartDate,
    //   ),
    //   imageUrl: extractedUrl,
    // })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Create New Prize Contest
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contest Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          field.onChange(file)
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </FormControl>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 max-w-xs rounded"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contest title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter contest description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="submissionStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Submission Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[280px] justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP HH:mm')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          hidden={{
                            before: new Date(),
                            from: new Date(),
                          }}
                          disabled={(date) =>
                            date < subDays(new Date(), 1) ||
                            date < new Date('1900-01-01')
                          }
                        />
                        <div className="p-3 border-t border-border">
                          <TimePicker
                            setDate={field.onChange}
                            date={field.value}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="submissionEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Submission End Date And Voting Start date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[280px] justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP HH:mm:ss')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(e) => {
                            console.log(e)
                            form.setValue('votingStartDate', e as Date)
                            field.onChange(e)
                          }}
                          hidden={{
                            before: new Date(),
                          }}
                          disabled={(date) =>
                            date < subDays(new Date(), 1) ||
                            date <=
                              subDays(form.getValues('submissionStartDate'), 1)
                          }
                        />
                        <div className="p-3 border-t border-border">
                          <TimePicker
                            setDate={(e) => {
                              console.log(e)
                              form.setValue('votingStartDate', e as Date)
                              field.onChange(e)
                            }}
                            date={field.value}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="votingEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Voting End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[280px] justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP HH:mm:ss')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            date < new Date('1900-01-01') ||
                            date < new Date(form.getValues('submissionEndDate'))
                          }
                        />
                        <div className="p-3 border-t border-border">
                          <TimePicker
                            setDate={field.onChange}
                            date={field.value}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={mutation.isPending}
              type="submit"
              className="w-full"
            >
              Create Prize
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
