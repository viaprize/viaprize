import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@viaprize/ui/form'
import { Input } from '@viaprize/ui/input'
import type { UseFormReturn } from 'react-hook-form'
import type { FormValues } from './form-schema'
import TopicsSelector from './topic-selector'

type SkillsCategoryStepProps = {
  form: UseFormReturn<FormValues>
}

export function SkillsCategoryStep({ form }: SkillsCategoryStepProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Required Skills</FormLabel>
            <FormControl>
              <TopicsSelector
                topics={form.getValues('skills')}
                setSelectedTopics={field.onChange}
                selectedTopics={field.value}
                allowAddOptions={true}
                wrapperClassName="flex-row flex-wrap"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
    </>
  )
}
