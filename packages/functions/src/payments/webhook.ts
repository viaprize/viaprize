import { PRIZE_V2_ABI, RESERVE_FUND_ABI } from '@viaprize/core/lib/abi'
import {
  CONTRACT_CONSTANTS_PER_CHAIN,
  type ValidChainIDs,
} from '@viaprize/core/lib/constants'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import Stripe from 'stripe'
import { parseEventLogs, parseSignature } from 'viem'
import { Charge, type Charges } from '../types'
import { viaprize } from '../utils/viaprize'
import { checkoutMetadataSchema } from './checkout'

const isCampaign = (str: string) => str !== 'https://stripe.com'
export const handler: APIGatewayProxyHandlerV2 = async (event, ctx) => {
  const signature = event.headers['stripe-signature']
  const body = event.body
  if (!process.env.WEBHOOK_SECRET) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No stripe webhook secret provided' }),
    }
  }
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No stripe event body provided' }),
    }
  }
  if (!signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No stripe signature provided' }),
    }
  }
  const webhookEvent = Stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.WEBHOOK_SECRET,
  )
  switch (webhookEvent.type) {
    case 'checkout.session.completed': {
      if (isCampaign(webhookEvent.data.object?.success_url ?? '')) {
        if (!webhookEvent.data.object.metadata) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No metadata provided' }),
          }
        }

        const eventData = webhookEvent.data.object

        const email = eventData.customer_details?.email
        if (!email) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No receipt email provided' }),
          }
        }
        const campaignMetadata = checkoutMetadataSchema.parse(
          webhookEvent.data.object.metadata,
        )
        if (!eventData.amount_total || !eventData.amount_subtotal) {
          return {
            statusCode: 400,
            body: 'Invalid request without payment intent or amount total',
          }
        }
        let username: string | undefined
        let signature: string | undefined
        let hash: string | undefined

        const doesEmailExist = await viaprize.users.emailExists(
          email.toLocaleLowerCase(),
        )
        if (!campaignMetadata.username && !doesEmailExist) {
          const preBoardedUser = await viaprize.users.preBoardUserByEmail(
            email.toLowerCase(),
          )
          username = preBoardedUser.username
          const custodialSign =
            await viaprize.wallet.signUsdcTransactionForCustodial({
              deadline: Number.parseInt(campaignMetadata.deadline),
              key: preBoardedUser.wallet.key,
              spender: campaignMetadata.spender as `0x${string}`,
              value: Number.parseInt(campaignMetadata.amount),
            })
          hash = custodialSign.hash
          signature = custodialSign.signature
        } else if (campaignMetadata.username) {
          username = campaignMetadata.username
          hash = campaignMetadata.ethSignedMessage
          signature = campaignMetadata.signature
        }
        if (!username) {
          return {
            statusCode: 400,
            body: 'Invalid request without username',
          }
        }
        if (!hash || !signature) {
          return {
            statusCode: 400,
            body: 'Invalid request without hash or signature',
          }
        }
        const reserveAddress = await viaprize.wallet.getAddress(
          'reserve',
          'vault',
        )
        const chainId = Number.parseInt(campaignMetadata.chainId)
        const constants = CONTRACT_CONSTANTS_PER_CHAIN[chainId as ValidChainIDs]
        const rsv = parseSignature(signature as `0x${string}`)
        const data = viaprize.prizes.blockchain.getEncodedReserveAddFunds(
          campaignMetadata.spender as `0x${string}`,
          reserveAddress as `0x${string}`,
          Number.parseInt(campaignMetadata.amount),
          Number.parseInt(campaignMetadata.deadline),
          Number.parseInt(rsv.v?.toString() ?? '1'),
          rsv.s,
          rsv.r,
          hash as `0x${string}`,
        )
        const txReceipt = await viaprize.wallet.sendTransaction(
          [
            {
              data,
              to: constants.RESERVE_FUND_PRIZE_ADDRESS,
              value: '0',
            },
          ],
          'reserve',
        )

        const events = parseEventLogs({
          abi: PRIZE_V2_ABI,
          logs: txReceipt.logs,
          eventName: 'Donation',
        })
        const donationEvents = events.filter((e) => e.eventName === 'Donation')
        if (donationEvents.length === 0) {
          return {
            statusCode: 400,
            body: 'Invalid request without donation event',
          }
        }

        await viaprize.prizes.addUsdcFunds({
          donor: donationEvents[0].args.donator,
          isFiat: true,
          recipientAddress: campaignMetadata.spender,
          valueInToken: donationEvents[0].args.amount.toString(),
          prizeId: campaignMetadata.backendId,
          username: username,
          paymentId: eventData.id,
          transactionId: txReceipt.transactionHash,
        })
      }
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  }
}
