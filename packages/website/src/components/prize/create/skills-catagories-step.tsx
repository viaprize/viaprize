import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@viaprize/ui/form'
import { Input } from '@viaprize/ui/input'
import type { UseFormReturn } from 'react-hook-form'
import TopicsSelector from './topic-selector'

type SkillsCategoryStepProps = {
  form: UseFormReturn<any>
}

export function SkillsCategoryStep({ form }: SkillsCategoryStepProps) {
  const suggestedSkills = [
    { value: 'JavaScript', label: 'JavaScript', icon: '🟨' },
    { value: 'React', label: 'React', icon: '⚛️' },
    { value: 'Node.js', label: 'Node.js', icon: '🟩' },
    { value: 'UI/UX Design', label: 'UI/UX Design', icon: '🎨' },
  ]

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
                topics={suggestedSkills}
                setSelectedTopics={field.onChange}
                selectedTopics={field.value}
                allowAddOptions={true}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
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
      />
    </>
  )
}
