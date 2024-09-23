import { TRPCError } from "@trpc/server";
import { Events } from "@viaprize/core/viaprize";
import { Resource } from "sst";
import { bus } from "sst/aws/bus";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  withCache,
} from "../trpc";
export const prizeRouter = createTRPCRouter({
  getActivePrizes: publicProcedure.query(async ({ ctx }) => {
    const count = await withCache(
      ctx,
      ctx.viaprize.prizes.getCacheTag("ACTIVE_PRIZES_COUNT"),
      async () => await ctx.viaprize.prizes.getDeployedPrizesCount()
    );
    return count ?? 0;
  }),
  getPrizeBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const prize = await withCache(
        ctx,
        ctx.viaprize.prizes.getCacheTag("SLUG_PRIZE", input),
        async () => await ctx.viaprize.prizes.getPrizeBySlug(input)
      );
      return prize;
    }),
  getDeployedPrizes: publicProcedure.query(async ({ ctx }) => {
    const prizes = await withCache(
      ctx,
      ctx.viaprize.prizes.getCacheTag("DEPLOYED_PRIZES"),
      async () => {
        const a = await ctx.viaprize.prizes.getDeployedPrizes();
        console.log(a);
        return a;
      }
    );
    return prizes;
  }),
  getPendingPrizes: adminProcedure.query(async ({ ctx }) => {
    const prizes = await withCache(
      ctx,
      ctx.viaprize.prizes.getCacheTag("PENDING_PRIZES"),
      async () => await ctx.viaprize.prizes.getPendingPrizes()
    );
    return prizes;
  }),
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
      console.log("hiiiiiii");

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

      await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
        key: ctx.viaprize.prizes.getCacheTag("PENDING_PRIZES"),
      });

      return prizeId;
    }),

  addSubmission: adminProcedure
    .input(
      z.object({
        prizeId: z.string(),
        contestant: z.string(),
        submissionText: z.string().min(10, {
          message: "Submission must be at least 10 characters.",
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const prize = await ctx.viaprize.prizes.getPrizeById(input.prizeId);
      if (!prize) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prize not found",
          cause: "Prize not found",
        });
      }

      if (!ctx.session.user.walletAddress) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must have a wallet address to create a prize",
          cause: "User does not have a wallet address",
        });
      }

      const txData = await ctx.viaprize.prizes.getEncodedAddSubmissionData(
        input.contestant as `0x${string}`,
        input.submissionText
      );

      const simulated = await ctx.viaprize.wallet.simulateTransaction(
        {
          data: txData,
          to: prize.primaryContractAddress as `0x${string}`,
          value: "0",
        },
        "gasless",
        "signer"
      );
      if (!simulated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Transaction failed",
          cause: "Transaction failed",
        });
      }
      const txHash = await ctx.viaprize.wallet.sendTransaction(
        [
          {
            data: txData,
            to: prize.primaryContractAddress as `0x${string}`,
            value: "0",
          },
        ],
        "gasless"
      );

      if (txHash) {
        await ctx.viaprize.prizes.addSubmission({
          submissionHash: txHash,
          contestant: input.contestant,
          submissionText: input.submissionText,
          prizeId: input.prizeId,
          username: ctx.session.user.username as string,
        });
      }
      return txHash;
    }),

  addVote: adminProcedure
    .input(
      z.object({
        prizeId: z.string(),
        submissionHash: z.string(),
        voteAmount: z.number(),
        v: z.number(),
        s: z.string(),
        r: z.string(),
      })
    )

    .mutation(async ({ input, ctx }) => {
      const prize = await ctx.viaprize.prizes.getPrizeById(input.prizeId);
      if (!prize) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prize not found",
          cause: "Prize not found",
        });
      }
      if (!(ctx.session.user.walletAddress && ctx.session.user.username)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must have a wallet address and username to cast a vote",
          cause: "User does not have a wallet address or username",
        });
      }

      const txData = await ctx.viaprize.prizes.getEncodedAddVoteData(
        input.submissionHash as `0x${string}`,
        BigInt(input.voteAmount),
        input.v,
        input.s as `0x${string}`,
        input.r as `0x${string}`
      );

      const simulated = await ctx.viaprize.wallet.simulateTransaction(
        {
          data: txData,
          to: prize.primaryContractAddress as `0x${string}`,
          value: "0",
        },
        "gasless",
        "signer"
      );
      if (!simulated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Transaction failed",
          cause: "Transaction failed",
        });
      }
      const txHash = await ctx.viaprize.wallet.sendTransaction(
        {
          data: txData,
          to: prize.primaryContractAddress as `0x${string}`,
          value: "0",
        },
        "gasless"
      );

      if (txHash) {
        await ctx.viaprize.prizes.addVote({
          funderAddress: ctx.session.user.walletAddress,
          prizeId: input.prizeId,
          submissionHash: input.submissionHash,
          username: ctx.session.user.username,
          voteAmount: input.voteAmount,
        });
      }
      return txHash;
    }),
});
