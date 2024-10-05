import * as z from 'zod'

export const searchParamsSchema = z.object({
  sort: z.string().optional().default('createdAt.desc'),
})

export const prizeFilterParamsSchema = searchParamsSchema.extend({
  categories: z.string().optional(), // Comma-separated string
  prizeAmount: z.string().optional(), // Format: 'min-max'
  prizeStatus: z.enum(['active', 'ended']).optional().default('active'),
  sort: z.enum(['DESC', 'ASC']).optional().default('DESC'),
})
