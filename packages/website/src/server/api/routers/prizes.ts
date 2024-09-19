import { TRPCError } from '@trpc/server'
import { Events } from '@viaprize/core/viaprize'
import { Resource } from 'sst'
import { bus } from 'sst/aws/bus'
import { z } from 'zod'

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  withCache,
} from '../trpc'
export const prizeRouter = createTRPCRouter({
  getPendingPrizes: adminProcedure.query(async ({ ctx }) => {
    const prizes = await withCache(
      ctx,
      ctx.viaprize.prizes.getCacheTag('PENDING_PRIZES'),
      async () => await ctx.viaprize.prizes.getPendingPrizes(),
    )
    return prizes
  }),
  deployPrize: adminProcedure
    .input(
      z.object({
        prizeId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const txData = await ctx.viaprize.prizes.getEncodedDeployPrizeData(
        input.prizeId,
      )
      const prizeFactoryAddress = ctx.viaprize.prizes.getPrizeFactoryV2Address()
      const simulated = await ctx.viaprize.wallet.simulateTransaction(
        {
          data: txData,
          to: prizeFactoryAddress,
          value: '0',
        },
        'gasless',
        'signer',
      )

      if (!simulated) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Transaction failed',
          cause: 'Transaction failed',
        })
      }
      const txHash = await ctx.viaprize.wallet.sendTransaction(
        {
          data: txData,
          to: prizeFactoryAddress,
          value: '0',
        },
        'gasless',
      )
      if (txHash) {
        await ctx.viaprize.prizes.approvePrizeProposal(input.prizeId)
      }
      await bus.publish(Resource.EventBus.name, Events.Cache.Set, {
        key: ctx.viaprize.prizes.getCacheTag('PENDING_PRIZES'),
        value: '',
        type: 'dynamodb',
      })
      return txHash
    }),
  createPrize: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2, {
          message: 'Title must be at least 2 characters.',
        }),
        description: z.string().min(10, {
          message: 'Description must be at least 10 characters.',
        }),
        submissionStartDate: z.string(),
        submissionDuration: z.number().min(1, {
          message: 'Submission duration must be at least 1 minute.',
        }),
        votingStartDate: z.string(),
        votingDuration: z.number().min(1, {
          message: 'Voting duration must be at least 1 minute.',
        }),
        imageUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.username) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to create a prize',
          cause: 'User is not logged in',
        })
      }

      if (!ctx.session.user.walletAddress) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must have a wallet address to create a prize',
          cause: 'User does not have a wallet address',
        })
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
      })

      await bus.publish(Resource.EventBus.name, Events.Cache.Set, {
        key: ctx.viaprize.prizes.getCacheTag('PENDING_PRIZES'),
        value: '',
        type: 'dynamodb',
      })

      return prizeId
    }),
})
