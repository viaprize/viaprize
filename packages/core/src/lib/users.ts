import { and, desc, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import type { z } from 'zod'
import type { ViaprizeDatabase } from '../database'
import { type insertUserSchema, users, wallets } from '../database/schema'
import { CacheTag } from './cache-tag'
import type { Wallet } from './wallet'

const CACHE_TAGS = {
  LASTEST_LEADERBOARD: { value: 'latest-leaderboard', requiresSuffix: false },
} as const

export class Users extends CacheTag<typeof CACHE_TAGS> {
  db
  wallet
  constructor(viaprizeDb: ViaprizeDatabase, wallet: Wallet) {
    super(CACHE_TAGS)
    this.db = viaprizeDb.database
    this.wallet = wallet
  }
  async getLatestUsersByTotalFundsWon(limit = 3) {
    return await this.db.query.users.findMany({
      orderBy: desc(users.totalFundsWon),
      limit,
    })
  }
  async updateUserById(id: string, data: z.infer<typeof insertUserSchema>) {
    await this.db
      .update(users)
      .set(data as any)
      .where(eq(users.id, id))
  }
  async getUserById(id: string) {
    return await this.db.query.users.findFirst({
      columns: {
        username: true,
        email: true,
        image: true,
        name: true,
        isAdmin: true,
      },
      with: {
        wallets: {
          columns: {
            address: true,
          },
        },
      },
      where: eq(users.id, id),
    })
  }

  async usernameExists(username: string) {
    const result = await this.db
      .select({
        username: users.username,
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
    return result.length > 0
  }

  async getUserByWalletAddress(walletAddress: string) {
    const address = walletAddress.toLowerCase()
    const result = await this.db.query.wallets.findFirst({
      with: {
        user: {
          columns: {
            name: true,
            id: true,
            email: true,
            isAdmin: true,
          },
        },
      },
      where: and(
        eq(wallets.address, address),
        eq(wallets.username, users.username),
      ),
    })

    return result?.user
  }

  async onboardUser(data: {
    name: string
    email: string
    walletAddress?: string
    network: string
    username: string
    userId: string
  }) {
    let address = data.walletAddress
      ? data.walletAddress.toLowerCase()
      : undefined
    let key: string
    if (!address) {
      const wallet = await this.wallet.generateWallet()
      address = wallet.address.toLowerCase()
      key = wallet.key
    }
    if (!address) {
      throw new Error('Address is required either not generated')
    }
    if (!data.walletAddress) {
      await this.db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            name: data.name,
            email: data.email,
            username: data.username,
          })
          .where(eq(users.id, data.userId))
        await tx.insert(wallets).values({
          address: address,
          network: data.network,
          key: key,
          username: data.username,
        })
      })
      return true
    }
    await this.db
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        username: data.username,
      })
      .where(eq(users.id, data.userId))

    return true
  }

  async createUserFromWalletAddress(data: {
    walletAddress: string
    network: string
  }) {
    const userId = nanoid(12)
    await this.db.transaction(async (tx) => {
      await tx.insert(users).values({
        username: data.walletAddress,
        id: userId,
      })
      await tx.insert(wallets).values({
        address: data.walletAddress.toLowerCase(),
        network: data.network,
        username: data.walletAddress,
      })
    })

    return userId
  }
}
