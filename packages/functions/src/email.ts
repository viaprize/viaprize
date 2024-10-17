import { LoopsClient } from 'loops'

export const email = new LoopsClient(
  (process.env.LOOPS_API_KEY as string) ?? '',
)
