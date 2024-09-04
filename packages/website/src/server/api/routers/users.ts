import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input, ctx }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  onboardUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        walletAddress: z.string().optional(),
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.viaprize.users.onboardUser({
        email: input.email,
        name: input.name,
        walletAddress: input.walletAddress,
        network: "optimism",
        username: input.username,
      });
    }),
});
