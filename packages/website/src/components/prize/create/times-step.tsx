import { cn } from '@viaprize/ui'
import { Button } from '@viaprize/ui/button'
import { Calendar } from '@viaprize/ui/calendar'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@viaprize/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@viaprize/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { DateTimePicker } from './ai-date-time-picker/date-picker/date-time-picker'
import type { FormValues } from './form-schema'

export function TimingStep({ form }: { form: UseFormReturn<FormValues> }) {
  return (
    <div className="flex flex-col justify-between gap-5">
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn('w-[280px] justify-start text-left font-normal')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            // selected={dateTime}
            // onSelect={setDateTime}
            initialFocus
            className="self-center"
            fromDate={new Date()}
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>
      <FormField
        control={form.control}
        name="submissionStartDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Submission Start Date</FormLabel>
            <DateTimePicker
              dateTime={field.value}
              setDateTime={field.onChange}
              minDate={new Date()}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="submissionEndDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Submission End Date</FormLabel>
            <DateTimePicker
              dateTime={field.value}
              setDateTime={field.onChange}
              // disabled={(date) =>
              //   date < new Date() || date < new Date("1900-01-01")
              // }
            />
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
            <DateTimePicker
              dateTime={field.value}
              setDateTime={field.onChange}
              // disabled={(date) =>
              //   date < new Date() || date < new Date("1900-01-01")
              // }
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
