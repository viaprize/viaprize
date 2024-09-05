import { unstable_update } from "@/server/auth";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
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
      console.log("onboardUser", input);
      const usernameExists = await ctx.viaprize.users.usernameExists(
        input.username
      );
      console.log("usernameExists", usernameExists);
      if (usernameExists) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Username already exists",
        });
      }
      console.log("onboardUser", ctx.session.user.id);

      const success = await ctx.viaprize.users.onboardUser({
        email: input.email,
        name: input.name,
        walletAddress: input.walletAddress,
        network: "optimism",
        username: input.username,
        userId: ctx.session.user.id,
      });
      if (success) {
        await unstable_update({
          user: {
            email: input.email,
            name: input.name,
            walletAddress: input.walletAddress?.toLowerCase(),
            id: ctx.session.user.id,
            username: input.username,
          },
        });
      }
    }),
});
