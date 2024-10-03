import * as z from 'zod'

export const searchParamsSchema = z.object({
  sort: z.string().optional().default('createdAt.desc'),
})

export const prizeFilterParamsSchema = searchParamsSchema.extend({
  categories: z.string().array().optional(),
  subcategory: z.string().optional(),
  subcategories: z.string().optional(),
  price_range: z.string().optional(),
  userids: z.string().optional(),
  active: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['DESC', 'ASC']).optional().default('DESC'),
})
