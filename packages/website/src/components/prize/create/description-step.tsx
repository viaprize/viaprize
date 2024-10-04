import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@viaprize/ui/form'
import { Textarea } from '@viaprize/ui/textarea'

export function DescriptionStep({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tell us what you need done</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter a brief description or bullet points"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
