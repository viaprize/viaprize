import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
export const prizeRouter = createTRPCRouter({
  createPrize: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2, {
          message: "Title must be at least 2 characters.",
        }),
        description: z.string().min(10, {
          message: "Description must be at least 10 characters.",
        }),
        submissionStartDate: z.string(),
        submissionDuration: z.number().min(1, {
          message: "Submission duration must be at least 1 minute.",
        }),
        votingStartDate: z.string(),
        votingDuration: z.number().min(1, {
          message: "Voting duration must be at least 1 minute.",
        }),
        imageUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a prize",
          cause: "User is not logged in",
        });
      }

      if (!ctx.session.user.walletAddress) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must have a wallet address to create a prize",
          cause: "User does not have a wallet address",
        });
      }

      const prizeId = await ctx.viaprize.prizes.addPrizeProposal({
        description: input.description,
        imageUrl: input.imageUrl,
        submissionStartDate: input.submissionStartDate,
        submissionDuration: input.submissionDuration,
        title: input.title,
        username: ctx.session.user.username,
        votingDuration: input.votingDuration,
        votingStartDate: input.votingStartDate,
        proposerAddress: ctx.session.user.walletAddress,
      });

      return prizeId;
    }),
});
