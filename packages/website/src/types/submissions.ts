import type { api } from '@/trpc/server'

export type Submissions = NonNullable<
  Awaited<ReturnType<typeof api.prizes.getPrizeBySlug>>
>['submissions']
