import { Resource } from 'sst'
import { bus } from 'sst/aws/bus'
import { erc20Abi, hashTypedData, parseEventLogs } from 'viem'
import { ERC20_PERMIT_SIGN_TYPE, PRIZE_V2_ABI } from './lib/abi'
import type { ValidChainIDs } from './lib/constants'
import { Events, type Viaprize } from './viaprize'

export * as ViaprizeUtils from './viaprize-utils'

export async function publishDeployedPrizeCacheDelete(
  viaprize: Viaprize,
  slug?: string | null,
) {
  const promises: Promise<any>[] = []
  promises.push(
    bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
      key: viaprize.prizes.getCacheTag('DEPLOYED_PRIZES'),
    }),
  )

  if (slug) {
    promises.push(
      bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
        key: viaprize.prizes.getCacheTag('SLUG_PRIZE', slug ?? ''),
      }),
    )
    promises.push(
      bus.publish(Resource.EventBus.name, Events.Cache.Delete, {
        key: viaprize.prizes.getCacheTag('FUNDERS_SLUG_PRIZE', slug ?? ''),
      }),
    )
  }
  await Promise.all(promises)
}
export async function handleEndDispute(
  viaprize: Viaprize,
  txBody: typeof Events.Wallet.Transaction.$input,
  prizeContractAddress: string,
) {
  const prize =
    await viaprize.prizes.getPrizeByContractAddress(prizeContractAddress)
  if (!txBody.transactions[0]) {
    throw new Error('No transaction data found')
  }
  const funders =
    await viaprize.prizes.getFundersByContractAddress(prizeContractAddress)
  const funderAddresses = funders
    .map((f) => f.user?.wallets?.[0]?.address)
    .filter((item) => item !== undefined)
  console.log({ funderAddresses })
  const submissions = await viaprize.prizes.getSubmittersByPrizeId(prize.id)
  const submitterAddress = submissions.map((s) => s.submitterAddress)
  const receipt = await viaprize.wallet.sendTransaction(
    txBody.transactions,
    txBody.walletType ?? 'gasless',
  )
  console.log({ receipt })

  const contractLogs = parseEventLogs({
    logs: receipt.logs,
    abi: PRIZE_V2_ABI,
    eventName: ['FiatFunderRefund', 'CryptoFunderRefunded', 'DisputeEnded'],
  })
  console.log({ contractLogs })

  const transferLogs = parseEventLogs({
    logs: receipt.logs,
    abi: erc20Abi,
    eventName: 'Transfer',
  })
  const logs = [...contractLogs, ...transferLogs]

  const disputeEndedEvent = logs.filter((e) => e.eventName === 'DisputeEnded')
  const fiatFunderRefundEvents = logs.filter(
    (e) => e.eventName === 'FiatFunderRefund',
  )
  const cryptoFunderRefundedEvents = logs.filter(
    (e) => e.eventName === 'CryptoFunderRefunded',
  )
  const transferEvents = logs.filter((e) => e.eventName === 'Transfer')
  const totalCryptoFunderRefunded = cryptoFunderRefundedEvents.reduce(
    (acc, e) => acc + Number.parseInt(e.args._amount?.toString() ?? '0'),
    0,
  )
  const totalFiatFunderRefunded = fiatFunderRefundEvents.reduce(
    (acc, e) => acc + Number.parseInt(e.args._amount?.toString() ?? '0'),
    0,
  )
  const submitterTransactionLogs = transferEvents.filter((e) => {
    return submitterAddress
      .map((s) => s.toLowerCase())
      .includes(e.args.to.toLowerCase())
  })

  const submissionWon: {
    username: string | null
    submissionHash: string
    submitterAddress: string
    won: number
  }[] = []
  submitterTransactionLogs.forEach((log) => {
    const submission = submissions.find(
      (s) => s.submitterAddress.toLowerCase() === log.args.to.toLowerCase(),
    )
    if (!submission) {
      return
    }
    submissionWon.push({
      won: Number.parseInt(log.args.value.toString()),
      ...submission,
    })
  })
  const platformTransactionLogs = transferEvents.slice(-2)
  console.log({ platformTransactionLogs })
  if (disputeEndedEvent.length > 0) {
    await viaprize.prizes.endDisputeByContractAddress({
      contractAddress: prizeContractAddress,
      totalRefunded: totalCryptoFunderRefunded + totalFiatFunderRefunded,
      updatedSubmissions: submissionWon,
    })
  }
}
export async function handleEndSubmissionTransaction(
  viaprize: Viaprize,
  txBody: typeof Events.Wallet.Transaction.$input,
  prizeContractAddress: string,
) {
  const prize =
    await viaprize.prizes.getPrizeByContractAddress(prizeContractAddress)
  if (!txBody.transactions[0]) {
    throw new Error('No transaction data found')
  }
  console.log({ prize })
  const finalTxData =
    prize.numberOfSubmissions > 0
      ? txBody.transactions
      : [txBody.transactions[0]]
  await viaprize.prizes.startVotingPeriodByContractAddress(prizeContractAddress)

  await viaprize.wallet.withTransactionEvents(
    PRIZE_V2_ABI,
    finalTxData,
    'gasless',
    [
      'SubmissionEnded',
      'VotingEnded',
      'CryptoFunderRefunded',
      'FiatFunderRefund',
    ],
    async (event) => {
      console.log(`${JSON.stringify(event)} event received`)
      const submissionEndedEvents = event.filter(
        (e) => e.eventName === 'SubmissionEnded',
      )
      const votingEndedEvents = event.filter(
        (e) => e.eventName === 'VotingEnded',
      )
      const cryptoFunderRefundedEvents = event.filter(
        (e) => e.eventName === 'CryptoFunderRefunded',
      )
      const fiatFunderRefundEvents = event.filter(
        (e) => e.eventName === 'FiatFunderRefund',
      )

      console.log({ votingEndedEvents })
      console.log({ submissionEndedEvents })
      console.log({ cryptoFunderRefundedEvents })

      if (submissionEndedEvents && votingEndedEvents) {
        await viaprize.prizes.startVotingPeriodByContractAddress(
          prizeContractAddress,
        )
      }
      if (submissionEndedEvents) {
        await viaprize.prizes.startVotingPeriodByContractAddress(
          prizeContractAddress,
        )
      }
      if (cryptoFunderRefundedEvents || fiatFunderRefundEvents) {
        const totalCryptoFunderRefunded = cryptoFunderRefundedEvents.reduce(
          (acc, e) => acc + Number.parseInt(e.args._amount?.toString() ?? '0'),
          0,
        )
        const totalFiatFunderRefunded = fiatFunderRefundEvents.reduce(
          (acc, e) => acc + Number.parseInt(e.args._amount?.toString() ?? '0'),
          0,
        )

        await viaprize.prizes.refundByContractAddress({
          primaryContractAddress: prizeContractAddress,
          totalRefunded: totalCryptoFunderRefunded + totalFiatFunderRefunded,
        })
      }
    },
  )
  await publishDeployedPrizeCacheDelete(viaprize, prize.slug)
}
