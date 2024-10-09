import { LoopsClient } from 'loops'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

const loops = new LoopsClient(process.env.LOOPS_API_KEY ?? '')

export const loopsRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        subscribeToNewsletter: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, subscribeToNewsletter } = input

      if (!subscribeToNewsletter) {
        return { message: 'User did not opt-in for the newsletter.' }
      }
      try {
        const response: { success: boolean } = await loops.sendEvent({
          email: email,
          eventName: 'newsletter',
        })
        console.log(response)
      } catch (error) {
        console.log(`failed to send an email ${error}`)
        return { message: `Failed to send email ${error}` }
      }
    }),
})
