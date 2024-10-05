import { viaprize } from "@/server/viaprize";
import { TRPCError } from "@trpc/server";
import { PRIZE_FACTORY_ABI, PRIZE_V2_ABI } from "@viaprize/core/lib/abi";
import { Events } from "@viaprize/core/viaprize";
import { ViaprizeUtils } from "@viaprize/core/viaprize-utils";
import { revalidatePath } from "next/cache";
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
  getContestants: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const contestants = await ctx.viaprize.prizes.getContestants(input);
      return contestants;
    }),
  getPrizeActivities: publicProcedure.query(async ({ ctx }) => {
    const totalPrizePool =
      Number.parseInt(
        (await ctx.cacheClient.get(
          ctx.viaprize.prizes.getCacheTag("TOTAL_PRIZE_POOL")
        )) ?? "0"
      ) ?? 0;
    const totalIdeas =
      (await withCache(
        ctx,
        ctx.viaprize.prizes.getCacheTag("ACTIVE_PRIZES_COUNT"),
        async () => await ctx.viaprize.prizes.getDeployedPrizesCount()
      )) ?? 0;
    const recentActivities =
      (await withCache(
        ctx,
        ctx.viaprize.prizes.getCacheTag("LATEST_PRIZE_ACTIVITES"),
        async () => await ctx.viaprize.prizes.getLatestActivitiesInPrizes()
      )) ?? [];
    const leaderboards =
      (await withCache(
        ctx,
        ctx.viaprize.users.getCacheTag("LASTEST_LEADERBOARD"),
        async () => await ctx.viaprize.users.getLatestUsersByTotalFundsWon()
      )) ?? [];
    return {
      totalPrizePool,
      totalIdeas,
      recentActivities: recentActivities,
      leaderboards,
    };
  }),

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
  deployPrize: adminProcedure
    .input(
      z.object({
        prizeId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const prize = await ctx.viaprize.prizes.getPrizeById(input.prizeId);
      const txData =
        await ctx.viaprize.prizes.blockchain.getEncodedDeployPrizeData({
          authorFeePercentage: prize.authorFeePercentage,
          id: prize.id,
          platformFeePercentage: prize.platformFeePercentage,
          proposerAddress: prize.proposerAddress,
        });
      const prizeFactoryAddress =
        ctx.viaprize.prizes.blockchain.getPrizeFactoryV2Address();
      const txHash = await ctx.viaprize.wallet.withTransactionEvents(
        PRIZE_FACTORY_ABI,
        [
          {
            data: txData,
            to: prizeFactoryAddress,
            value: "0",
          },
        ],
        "gasless",
        ["NewViaPrizeCreated"],
        async (events) => {
          await ctx.viaprize.prizes.approvePrizeProposal(input.prizeId);
          if (!events[0]?.args.viaPrizeAddress) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Contract address not found",
              cause: "Contract address not found",
            });
          }
          if (events[0]?.args.viaPrizeAddress) {
            await bus.publish(Resource.EventBus.name, Events.Prize.Approve, {
              contractAddress: events[0].args.viaPrizeAddress,
              prizeId: input.prizeId,
            });
          }
        }
      );
      await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
        key: ctx.viaprize.prizes.getCacheTag("PENDING_PRIZES"),
      });
      return txHash;
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

      if (!ctx.session.user.wallet) {
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
        proposerAddress: ctx.session.user.wallet.address,
      });

      await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
        key: ctx.viaprize.prizes.getCacheTag("PENDING_PRIZES"),
      });

      return prizeId;
    }),

  addSubmission: protectedProcedure
    .input(
      z.object({
        prizeId: z.string(),
        submissionText: z.string().min(10, {
          message: "Submission must be at least 10 characters.",
        }),
        projectLink: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const submitterAddress = ctx.session.user.wallet?.address;
      const prize = await ctx.viaprize.prizes.getPrizeById(input.prizeId);
      if (!prize) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prize not found",
          cause: "Prize not found",
        });
      }
      if (!submitterAddress) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must have a wallet address to create a prize",
          cause: "User does not have a wallet address",
        });
      }

      if (!ctx.session.user.wallet?.address) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must have a wallet address to create a prize",
          cause: "User does not have a wallet address",
        });
      }

      const txData =
        await ctx.viaprize.prizes.blockchain.getEncodedAddSubmissionData(
          submitterAddress as `0x${string}`,
          input.submissionText
        );

      const simulated = await ctx.viaprize.wallet.simulateTransaction(
        {
          data: txData,
          to: prize.primaryContractAddress as `0x${string}`,
          value: "0",
        },
        "gasless",
        "vault"
      );
      if (!simulated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Transaction failed",
          cause: "Transaction failed",
        });
      }
      const txHash = await ctx.viaprize.wallet.withTransactionEvents(
        PRIZE_V2_ABI,
        [
          {
            data: txData,
            to: prize.primaryContractAddress as `0x${string}`,
            value: "0",
          },
        ],
        "gasless",
        "SubmissionCreated",
        async (events) => {
          const submissionCreatedEvents = events.filter(
            (e) => e.eventName === "SubmissionCreated"
          );
          if (!submissionCreatedEvents[0]?.args.submissionHash) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Submission hash not found",
              cause: "Submission hash not found",
            });
          }
          await ctx.viaprize.prizes.addSubmission({
            submissionHash: submissionCreatedEvents[0].args.submissionHash,
            submitterAddress: submitterAddress,
            description: input.submissionText,
            prizeId: input.prizeId,
            username: ctx.session.user.username as string,
          });
        }
      );
      if (txHash) {
        await ViaprizeUtils.publishDeployedPrizeCacheDelete(
          viaprize,
          prize.slug
        );
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
      if (!(ctx.session.user.wallet?.address && ctx.session.user.username)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must have a wallet address and username to cast a vote",
          cause: "User does not have a wallet address or username",
        });
      }

      const txData = await ctx.viaprize.prizes.blockchain.getEncodedAddVoteData(
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
        await ctx.viaprize.prizes.addVote({
          voteHash: txHash.contractAddress as `0x${string}`,
          submissionHash: input.submissionHash,
          prizeId: input.prizeId,
          funderAddress: ctx.session.user.wallet?.address,
          voteAmount: input.voteAmount,
          username: ctx.session.user.username,
        });
      }
      return txHash;
    }),

  addContestant: protectedProcedure
    .input(
      z.object({
        prizeId: z.string(),
        slug: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.username) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to enter a prize",
          cause: "User is not logged in",
        });
      }

      await ctx.viaprize.prizes.addContestant({
        prizeId: input.prizeId,
        username: ctx.session.user.username,
      });

      await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
        key: ctx.viaprize.prizes.getCacheTag("DEPLOYED_PRIZES"),
      });
      await bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
        key: ctx.viaprize.prizes.getCacheTag("SLUG_PRIZE", input.slug),
      });
    }),

  addUsdcFundsForUser: protectedProcedure
    .input(
      z.object({
        prizeId: z.string(),
        amount: z.number(),
        deadline: z.number(),
        v: z.number(),
        s: z.string(),
        r: z.string(),
        ethSignedHash: z.string(),
        token: z.string(),
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
      if (
        !(
          ctx.session.user.wallet?.address &&
          ctx.session.user.username &&
          ctx.session.user.name
        )
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must have a wallet address and username to cast a vote",
          cause: "User does not have a wallet address or username",
        });
      }

      const txData =
        await ctx.viaprize.prizes.blockchain.getEncodedAddUsdcFunds(
          BigInt(input.amount),
          BigInt(input.deadline),
          input.v,
          input.s as `0x${string}`,
          input.r as `0x${string}`,
          input.ethSignedHash as `0x${string}`,
          false
        );

      const simulated = await ctx.viaprize.wallet.simulateTransaction(
        {
          data: txData,
          to: prize.primaryContractAddress as `0x${string}`,
          value: "0",
        },
        "gasless",
        "vault"
      );
      if (!simulated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Transaction failed",
          cause: "Transaction failed",
        });
      }

      const txHash = await ctx.viaprize.wallet.withTransactionEvents(
        PRIZE_V2_ABI,
        [
          {
            data: txData,
            to: prize.primaryContractAddress as `0x${string}`,
            value: "0",
          },
        ],
        "gasless",
        "Donation",
        async (events) => {
          const fundsAddedEvents = events.filter(
            (e) => e.eventName === "Donation"
          );
          if (!fundsAddedEvents[0]?.args.amount) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "No donation found",
              cause: "No donation found",
            });
          }
          await ctx.viaprize.prizes.addUsdcFunds({
            recipientAddress: prize.primaryContractAddress as `0x${string}`,
            username: ctx.session.user.username,
            donor: ctx.session.user.name ?? "Anonymous",
            valueInToken: fundsAddedEvents[0]?.args.amount.toString(),
            isFiat: false,
          });
          await ViaprizeUtils.publishDeployedPrizeCacheDelete(
            viaprize,
            prize.slug
          );
        }
      );

      return txHash;
    }),

  endVoting: adminProcedure
    .input(z.object({ contractAddress: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const prize = await ctx.viaprize.prizes.getPrizeByContractAddress(
        input.contractAddress
      );
      const data = await ctx.viaprize.prizes.blockchain.getEncodedEndVoting();
      await viaprize.wallet.withTransactionEvents(
        PRIZE_V2_ABI,
        [
          {
            data,
            to: input.contractAddress,
            value: "0",
          },
        ],
        "gasless",
        "VotingEnded",
        async (events) => {
          await ctx.viaprize.prizes.endVotingPeriodByContractAddress(
            input.contractAddress
          );
        }
      );
      await ViaprizeUtils.publishDeployedPrizeCacheDelete(
        ctx.viaprize,
        prize.slug
      );
    }),
  endSubmissionAndStartVoting: adminProcedure
    .input(z.object({ contractAddress: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const prize = await ctx.viaprize.prizes.getPrizeByContractAddress(
        input.contractAddress
      );
      const data =
        await ctx.viaprize.prizes.blockchain.getEncodedEndSubmissionAndStartVoting(
          {
            votingDurationInMinutes: prize.votingDurationInMinutes,
          }
        );
      await ViaprizeUtils.handleEndSubmissionTransaction(
        viaprize,
        {
          transactions: [
            {
              data: data.endSubmissionPeriodData,
              to: input.contractAddress,
              value: "0",
            },
            {
              data: data.startVotingPeriodData,
              to: input.contractAddress,
              value: "0",
            },
          ],
          walletType: "gasless",
        },
        input.contractAddress
      );
    }),
  startSubmission: adminProcedure
    .input(
      z.object({
        contractAddress: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prize = await ctx.viaprize.prizes.getPrizeByContractAddress(
        input.contractAddress
      );
      const txData =
        await ctx.viaprize.prizes.blockchain.getEncodedStartSubmission(
          prize.submissionDurationInMinutes
        );
      const txReceipt = await ctx.viaprize.wallet.withTransactionEvents(
        PRIZE_V2_ABI,
        [
          {
            data: txData,
            to: input.contractAddress,
            value: "0",
          },
        ],
        "gasless",
        "SubmissionStarted",
        async (events) => {
          await ctx.viaprize.prizes.startSubmissionPeriodByContractAddress(
            input.contractAddress
          );
        }
      );
      await ViaprizeUtils.publishDeployedPrizeCacheDelete(
        ctx.viaprize,
        prize.slug
      );
      return txReceipt;
    }),
});
