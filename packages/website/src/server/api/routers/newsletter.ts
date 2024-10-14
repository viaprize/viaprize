import { LoopsClient } from 'loops'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import {env} from '@/env'
const loops = new LoopsClient(( env.LOOPS_API_KEY as string) ?? '')

export const loopsRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstname: z.string(),
        subscribeToNewsletter: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, firstname, subscribeToNewsletter } = input

      if (!subscribeToNewsletter) {
        return { message: 'User did not opt-in for the newsletter.' }
      }
      try {
        const response: { success: boolean } = await loops.sendEvent({
          email: email,
          eventName: 'newsletter',
          eventProperties: {
            firstname: firstname,
          },
        })
        console.log(email, firstname, subscribeToNewsletter)
        console.log(response)
      } catch (error) {
        console.log(`failed to send an email ${error}`)
        return { message: `Failed to send email ${error}` }
      }
    }),
})
