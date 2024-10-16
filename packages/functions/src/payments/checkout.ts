import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
} from 'aws-lambda'
import Stripe from 'stripe'
import { sepolia } from 'viem/chains'
import { z } from 'zod'

export const checkoutMetadataSchema = z.object({
  type: z.enum(['prize']).default('prize'),
  spender: z.string(),
  deadline: z.string(),
  signature: z.string().optional(),
  backendId: z.string(),
  chainId: z.string().default('10'),
  amount: z.string(),
  ethSignedMessage: z.string().optional(),
  username: z.string().optional(),
})
const stripeCheckoutSchema = z.object({
  checkoutMetadata: checkoutMetadataSchema,
  title: z.string(),
  imageUrl: z.string(),
  successUrl: z.string(),
  cancelUrl: z.string(),
})

export const handler: APIGatewayProxyHandlerV2 = async (event, ctx) => {
  console.log(
    '=========================STRIPE CHECKOUT=========================',
  )
  if (!process.env.PAYMENT_SECRET_KEY) {
    throw new Error('Missing Payment secret key')
  }
  const paymentClient = new Stripe(process.env.PAYMENT_SECRET_KEY)

  const body = stripeCheckoutSchema.parse(JSON.parse(event.body ?? '[]'))
  console.log(body.checkoutMetadata, 'checkout metadata')
  const session = await paymentClient.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: body.title,
            images: [body.imageUrl],
          },
          unit_amount:
            (Number.parseInt(body.checkoutMetadata.amount) / 1_000_000) * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: body.checkoutMetadata.type,
      spender: body.checkoutMetadata.spender,
      deadline: body.checkoutMetadata.deadline,
      signature: body.checkoutMetadata.signature ?? null,
      backendId: body.checkoutMetadata.backendId,
      chainId: body.checkoutMetadata.chainId.toString(),
      amount: body.checkoutMetadata.amount
        ? body.checkoutMetadata.amount.toString()
        : '0',
    },
    success_url: body.successUrl,
    cancel_url: body.cancelUrl,
  })
  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  }
}
