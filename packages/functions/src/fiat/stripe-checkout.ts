import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
} from 'aws-lambda'
import Stripe from 'stripe'
import { z } from 'zod'

export const checkoutMetadataSchema = z.object({
  type: z.enum(['prize']),
  v: z.number(),
  r: z.string(),
  s: z.string(),
  id: z.string(),
  chainId: z.number(),
  amount: z.number(),
  ethSignedMessage: z.string(),
  payWithoutLogin: z.enum(['true', 'false']),
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
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing Stripe secret key')
  }
  const paymentClient = new Stripe(process.env.STRIPE_SECRET_KEY)
  const body = stripeCheckoutSchema.parse(event.body)

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
          unit_amount: (body.checkoutMetadata.amount / 1_000_000) * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      ...body.checkoutMetadata,
    },
    success_url: body.successUrl,
    cancel_url: body.cancelUrl,
  })
  return {
    statusCode: 200,
    body: JSON.stringify({ session_url: session.url }),
  }
}
