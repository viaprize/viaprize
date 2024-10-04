import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@viaprize/ui/form'
import { Input } from '@viaprize/ui/input'
import { Textarea } from '@viaprize/ui/textarea'
import type { UseFormReturn } from 'react-hook-form'
import type { FormValues } from './form-schema'

export function TitleDescriptionStep({
  form,
}: {
  form: UseFormReturn<FormValues>
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fullDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
