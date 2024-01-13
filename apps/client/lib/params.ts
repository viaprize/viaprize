import * as z from "zod"

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    from: z.string().optional(),
    to: z.string().optional(),
    sort: z.string().optional().default("createdAt.desc"),
})

export const campaignSearchParamsSchema = searchParamsSchema
    .omit({ from: true, to: true })
    .extend({
        categories: z.string().optional(),
        subcategory: z.string().optional(),
        subcategories: z.string().optional(),
        price_range: z.string().optional(),
        userids: z.string().optional(),
        active: z.string().optional().default("true"),
    })
