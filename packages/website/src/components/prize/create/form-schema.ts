import { z } from 'zod'

export type Question = {
  question: string
  options: string[]
  multipleChoice: boolean
}

export const formSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long'),
  aiQuestions: z.array(
    z.object({
      question: z.string(),
      answer: z.union([z.string(), z.array(z.string())]),
    }),
  ),
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  fullDescription: z
    .string()
    .min(20, 'Full description must be at least 20 characters long'),
  skills: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  category: z.string().min(1, 'Category is required').optional(),
  submissionStartDate: z.date(),
  submissionEndDate: z.date(),
  votingEndDate: z.date(),
})

export type FormValues = z.infer<typeof formSchema>
