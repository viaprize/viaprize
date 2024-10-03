import { expect } from 'chai'
import { ethers } from 'hardhat'
import type { Kickstarter } from '../../typechain-types/proxyportals/kickstarter.sol'

let kickstarter: Kickstarter

beforeEach(async () => {
  const Kickstarter = await ethers.getContractFactory('Kickstarter')
  kickstarter = await Kickstarter.deploy()
})

describe('initialize', () => {
  it('should correctly initialize the contract', async () => {
    await kickstarter.deployed()

    const proposers = ['0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb']
    const admins = ['0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db']
    const goal = 100
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24
    const allowDonationAboveGoalAmount = false
    const platformFee = 10

    await kickstarter.initialize(
      proposers,
      admins,
      goal,
      deadline,
      allowDonationAboveGoalAmount,
      platformFee,
    )

    expect(await kickstarter.isProposer(proposers[0])).to.be.true
    expect(await kickstarter.isAdmin(admins[0])).to.be.true
    expect(await kickstarter.goalAmount()).to.equal(goal)
    expect(await kickstarter.deadline()).to.equal(deadline)
    expect(await kickstarter.allowDonationAboveGoalAmount()).to.equal(
      allowDonationAboveGoalAmount,
    )
    expect(await kickstarter.platformFee()).to.equal(platformFee)
  })
})

describe('addFunds', () => {
  it('should revert if no funds are sent', async () => {
    await expect(kickstarter.addFunds({ value: 0 })).to.be.revertedWith(
      'NotEnoughFunds',
    )
  })

  it('should revert if campaign is ended', async () => {
    await kickstarter.endEarlyandRefund()
    await expect(kickstarter.addFunds({ value: 100 })).to.be.revertedWith(
      'FundingToContractEnded',
    )
  })

  it('should correctly add funds', async () => {
    await kickstarter.addFunds({ value: 100 })

    expect(
      await kickstarter.patronAmount(
        (await ethers.provider.getSigner()).getAddress(),
      ),
    ).to.equal(100)
    expect(await kickstarter.totalFunds()).to.equal(100)
  })
})

describe('endEarlyandRefund', () => {
  it('should revert if not called by a proposer or admin', async () => {
    await expect(
      kickstarter
        .connect(
          await ethers.getSigner('0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c'),
        )
        .endEarlyandRefund(),
    ).to.be.revertedWith('You are not a proposer or admin.')
  })

  it('should correctly end the campaign', async () => {
    await kickstarter.endEarlyandRefund()
    expect(await kickstarter.isActive()).to.be.false
  })
})

describe('endKickStarterCampaign', () => {
  it('should revert if not called by a proposer or admin', async () => {
    await expect(
      kickstarter
        .connect(
          await ethers.getSigner('0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c'),
        )
        .endKickStarterCampaign(),
    ).to.be.revertedWith('You are not a proposer or admin')
  })
  it('should correctly end the campaign', async () => {
    await kickstarter.endKickStarterCampaign()
    expect(await kickstarter.isActive()).to.be.false
  })
})
