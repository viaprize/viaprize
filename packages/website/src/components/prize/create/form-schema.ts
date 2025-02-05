import { FileWithPath } from 'react-dropzone'
import { z } from 'zod'
import {
  FileWithPreview,
  FileWithPreviewSchema,
} from './image-ui/image-cropper'

export type Question = {
  question: string
  options: string[]
  multipleChoice: boolean
}

export const formSchema = z
  .object({
    description: z
      .string()
      .min(5, 'Description must be at least 10 characters long'),
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
    imageLocalUrl: z.string(),
  })
  // Submission start must be in the future (compared to now)
  .refine((data) => data.submissionStartDate >= new Date(), {
    message: 'Submission start date must be in the future',
    path: ['submissionStartDate'],
  })
  // Submission end must come after submission start
  .refine((data) => data.submissionEndDate > data.submissionStartDate, {
    message: 'Submission end date must be after submission start date',
    path: ['submissionEndDate'],
  })
  // Voting end must come after submission end
  .refine((data) => data.votingEndDate > data.submissionEndDate, {
    message: 'Voting end date must be after submission end date',
    path: ['votingEndDate'],
  })
export type FormValues = z.infer<typeof formSchema>
