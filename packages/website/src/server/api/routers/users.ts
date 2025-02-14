import { env } from '@/env'
import { unstable_update, userSessionSchema } from '@/server/auth'
import { TRPCError } from '@trpc/server'
import {
  CONTRACT_CONSTANTS_PER_CHAIN,
  type ValidChainIDs,
} from '@viaprize/core/lib/constants'
import csv from 'csv-parser'
import { LoopsClient } from 'loops'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
const loops = new LoopsClient((process.env.LOOPS_API_KEY as string) ?? '')

export const userRouter = createTRPCRouter({
  getUserStatistics: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const stats = await ctx.viaprize.users.getStatisticsByUsername(input)
      return stats
    }),

  getUserByUsername: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const user = await ctx.viaprize.users.getUserByUsername(input)
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }
      return user
    }),
  usdcBalance: protectedProcedure.query(async ({ ctx }) => {
    const user = userSessionSchema.parse(ctx.session.user)
    const balance = await ctx.viaprize.wallet.getUsdcBalance(
      user.wallet.address as `0x${string}`,
    )
    console.log('user wallet address', user.wallet.address)
    return balance.toString()
  }),
  sendToken: protectedProcedure
    .input(
      z.object({
        to: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = userSessionSchema.parse(ctx.session.user)
      if (!user.wallet.key) {
        throw new TRPCError({
          code: 'UNPROCESSABLE_CONTENT',
          message: 'This is only available for users with custodial wallet',
        })
      }
      const constants =
        CONTRACT_CONSTANTS_PER_CHAIN[
          Number.parseInt(env.CHAIN_ID) as ValidChainIDs
        ]
      const gaslessVault = ctx.viaprize.wallet.getAddress('gasless', 'vault')
      if (!gaslessVault) {
        throw new TRPCError({
          code: 'UNPROCESSABLE_CONTENT',
          message: 'Gasless vault not found',
        })
      }
      const deadline = Date.now() + 10000 * 60 * 10
      const res = await ctx.viaprize.wallet.signUsdcTransactionForCustodial({
        deadline: deadline,
        key: user.wallet.key,
        spender: gaslessVault as `0x${string}`,
        value: input.amount,
      })
      const permitTransaction =
        ctx.viaprize.wallet.getEncodedERC20PermitFunction(
          user.wallet.address as `0x${string}`,
          gaslessVault as `0x${string}`,
          BigInt(input.amount),
          BigInt(deadline),
          Number.parseInt(res.v?.toString() ?? '0'),
          res.r,
          res.s,
        )
      const transferFromTransaction =
        ctx.viaprize.wallet.getEncodedERC20TransferFromFunction(
          user.wallet.address as `0x${string}`,
          input.to as `0x${string}`,
          BigInt(input.amount),
        )
      const txHash = await ctx.viaprize.wallet.sendTransaction(
        [
          {
            data: permitTransaction,
            to: constants.USDC,
            value: '0',
          },
          {
            data: transferFromTransaction,
            to: constants.USDC,
            value: '0',
          },
        ],
        'gasless',
      )

      return txHash
    }),

  onboardUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        walletAddress: z.string().optional(),
        username: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log('onboardUser', input)
      const usernameExists = await ctx.viaprize.users.usernameExists(
        input.username,
      )
      console.log('usernameExists', usernameExists)
      if (usernameExists) {
        throw new TRPCError({
          code: 'UNPROCESSABLE_CONTENT',
          message: 'Username already exists',
        })
      }
      console.log('onboardUser', ctx.session.user.id)

      await ctx.viaprize.users.onboardUser({
        email: input.email,
        name: input.name,
        walletAddress: input.walletAddress,
        network: 'optimism',
        username: input.username,
        userId: ctx.session.user.id,
      })

      try {
        const onboardMail: { success: boolean } = await loops.sendEvent({
          email: input.email,
          eventName: 'onboardUser',
          eventProperties: {
            name: input.name,
            wallet: input.walletAddress as string,
            username: input.username,
          },
        })
        console.log(onboardMail)
      } catch (error) {
        console.log('error', error)
      }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        skillSets: z.array(z.string()),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = userSessionSchema.parse(ctx.session.user)
      const updatedUser = await ctx.viaprize.users.updateProfile(user.id, {
        name: input.name,
        skillSets: input.skillSets,
        image: input.image,
      })
      return updatedUser
    }),
})
