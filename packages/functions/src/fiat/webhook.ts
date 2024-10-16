import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import Stripe from 'stripe'

export const handler: APIGatewayProxyHandlerV2 = async (event, ctx) => {
  const signature = event.headers['stripe-signature']
  const body = event.body
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
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
    process.env.STRIPE_WEBHOOK_SECRET,
  )
}
