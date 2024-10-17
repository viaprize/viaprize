import {
  CHAIN_ID,
  DATABASE_URL,
  PAYMENT_SECRET_KEY,
  RPC_URL,
  WALLET_API_KEY,
  WALLET_PAYMENT_INFRA_API,
  WEBHOOK_SECRET,
} from './secrets'

export const router = new sst.aws.ApiGatewayV2('Router')

router.route('POST /payment/checkout', {
  handler: 'packages/functions/src/payments/checkout.handler',
  environment: {
    PAYMENT_SECRET_KEY: PAYMENT_SECRET_KEY.value,
    WEBHOOK_SECRET: WEBHOOK_SECRET.value,
  },
})

router.route('POST /payment/webhook', {
  handler: 'packages/functions/src/payments/webhook.handler',
  environment: {
    PAYMENT_SECRET_KEY: PAYMENT_SECRET_KEY.value,
    DATABASE_URL: DATABASE_URL.value,
    CHAIN_ID: CHAIN_ID.value,
    WALLET_PAYMENT_INFRA_API: WALLET_PAYMENT_INFRA_API.value,
    RPC_URL: RPC_URL.value,
    WALLET_API_KEY: WALLET_API_KEY.value,
    WEBHOOK_SECRET: WEBHOOK_SECRET.value,
  },
})
