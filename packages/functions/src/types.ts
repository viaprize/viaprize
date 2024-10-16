export type ScheduleType =
  | 'wallet.transaction'
  | 'wallet.startSubmission'
  | 'prize.endSubmissionAndStartVoting'
  | 'wallet.endSubmissionAndStartVoting'
  | 'wallet.endVoting'
  | 'wallet.endDispute'

export type Charge = {
  id: string
  object: string
  amount: number
  amount_captured: number
  amount_refunded: number
  application: string | null
  application_fee: string | null
  application_fee_amount: number | null
  balance_transaction: string | null
  billing_details: {
    address: {
      city: string | null
      country: string | null
      line1: string | null
      line2: string | null
      postal_code: string | null
      state: string | null
    }
    email: string | null
    name: string | null
    phone: string | null
  }
  calculated_statement_descriptor: string
  captured: boolean
  created: number
  currency: string
  customer: string | null
  description: string | null
  destination: string | null
  dispute: string | null
  disputed: boolean
  failure_balance_transaction: string | null
  failure_code: string | null
  failure_message: string | null
  fraud_details: Record<string, any>
  invoice: string | null
  livemode: boolean
  metadata: Record<string, any>
  on_behalf_of: string | null
  order: string | null
  outcome: {
    network_status: string
    reason: string | null
    risk_level: string
    risk_score: number
    seller_message: string
    type: string
  }
  paid: boolean
  payment_intent: string
  payment_method: string
  payment_method_details: {
    card: {
      amount_authorized: number
      authorization_code: string | null
      brand: string
      checks: {
        address_line1_check: string | null
        address_postal_code_check: string | null
        cvc_check: string
      }
      country: string
      exp_month: number
      exp_year: number
      extended_authorization: {
        status: string
      }
      fingerprint: string
      funding: string
      incremental_authorization: {
        status: string
      }
      installments: string | null
      last4: string
      mandate: string | null
      multicapture: {
        status: string
      }
      network: string
      network_token: {
        used: boolean
      }
      overcapture: {
        maximum_amount_capturable: number
        status: string
      }
      three_d_secure: {
        authentication_flow: string | null
        electronic_commerce_indicator: string
        exemption_indicator: string | null
        result: string
        result_reason: string | null
        transaction_id: string
        version: string
      }
      wallet: string | null
    }
    type: string
  }
  radar_options: Record<string, any>
  receipt_email: string | null
  receipt_number: string | null
  receipt_url: string
  refunded: boolean
  refunds: {
    object: string
    data: Array<any>
    has_more: boolean
    total_count: number
    url: string
  }
  review: string | null
  shipping: string | null
  source: string | null
  source_transfer: string | null
  statement_descriptor: string | null
  statement_descriptor_suffix: string | null
  status: string
  transfer_data: string | null
  transfer_group: string | null
}

export type Charges = {
  object: string
  data: Charge[]
  has_more: boolean
  total_count: number
  url: string
}
