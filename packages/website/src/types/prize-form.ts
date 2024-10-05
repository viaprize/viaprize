import { z } from 'zod'

export const questionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
})

export type QuestionType = z.infer<typeof questionSchema>
