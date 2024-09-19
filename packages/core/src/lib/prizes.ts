import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { encodeFunctionData } from "viem";
import type { ViaprizeDatabase } from "../database";
import { prizes } from "../database/schema";
import { PRIZE_FACTORY_ABI } from "../lib/abi";
import { CONTRACT_CONSTANTS_PER_CHAIN } from "./constants";
import { stringToSlug } from "./utils";

export class Prizes {
  db;
  chainId: number;
  constructor(viaprizeDb: ViaprizeDatabase, chainId: number) {
    this.db = viaprizeDb.database;
    this.chainId = chainId;
  }
  CACHE_TAGS = {
    PENDING_PRIZES: "pending-prizes",
  };

  getCacheTag(tag: keyof typeof Prizes.prototype.CACHE_TAGS, suffix?: string) {
    return `${this.CACHE_TAGS[tag]}${suffix ? `:${suffix}` : ""}`;
  }

  async getPendingPrizes() {
    const proposals = await this.db
      .select({
        id: prizes.id,
        title: prizes.title,
        description: prizes.description,
        imageUrl: prizes.imageUrl,
        submissionStartDate: prizes.startSubmissionDate,
        submissionDuration: prizes.submissionDurationInMinutes,
        votingStartDate: prizes.startVotingDate,
        votingDuration: prizes.votingDurationInMinutes,
        proposerAddress: prizes.proposerAddress,
        authorUsername: prizes.authorUsername,
      })
      .from(prizes)
      .where(eq(prizes.proposalStage, "PENDING"))
      .orderBy(desc(prizes.createdAt));

    return proposals;
  }

  async getPrizeById(prizeId: string) {
    const [prize] = await this.db
      .select({
        id: prizes.id,
        title: prizes.title,
        description: prizes.description,
        imageUrl: prizes.imageUrl,
        submissionStartDate: prizes.startSubmissionDate,
        submissionDuration: prizes.submissionDurationInMinutes,
        votingStartDate: prizes.startVotingDate,
        votingDuration: prizes.votingDurationInMinutes,
        proposerAddress: prizes.proposerAddress,
        authorUsername: prizes.authorUsername,
        authorFeePercentage: prizes.authorFeePercentage,
        platformFeePercentage: prizes.platformFeePercentage,
      })
      .from(prizes)
      .where(eq(prizes.id, prizeId));

    return prize;
  }

  getPrizeFactoryV2Address() {
    const constants =
      CONTRACT_CONSTANTS_PER_CHAIN[
        this.chainId as keyof typeof CONTRACT_CONSTANTS_PER_CHAIN
      ];
    return constants.PRIZE_FACTORY_V2_ADDRESS;
  }

  async approveDeployedPrize(prizeId: string, contractAddress: string) {
    await this.db.transaction(async (trx) => {
      const [prize] = await trx
        .select({
          proposalStage: prizes.proposalStage,
        })
        .from(prizes)
        .where(eq(prizes.id, prizeId))
        .limit(1);
      if (!prize) {
        throw new Error("Prize not found");
      }
      console.log(prize);
      if (prize.proposalStage !== "APPROVED_BUT_NOT_DEPLOYED") {
        throw new Error("Prize not in correct stage");
      }
      await trx
        .update(prizes)
        .set({
          primaryContractAddress: contractAddress,
          proposalStage: "APPROVED",
        })
        .where(eq(prizes.id, prizeId));
    });
  }

  async approvePrizeProposal(prizeId: string) {
    await this.db
      .update(prizes)
      .set({
        proposalStage: "APPROVED_BUT_NOT_DEPLOYED",
      })
      .where(eq(prizes.id, prizeId));
  }

  async getEncodedDeployPrizeData(prizeId: string) {
    const prize = await this.getPrizeById(prizeId);
    if (!prize) {
      throw new Error("Prize not found");
    }
    const constants =
      CONTRACT_CONSTANTS_PER_CHAIN[
        this.chainId as keyof typeof CONTRACT_CONSTANTS_PER_CHAIN
      ];

    const data = encodeFunctionData({
      abi: PRIZE_FACTORY_ABI,
      functionName: "createViaPrize",
      args: [
        prizeId,
        prize.proposerAddress as `0x${string}`,
        constants.ADMINS,
        prize.platformFeePercentage,
        prize.authorFeePercentage,
        constants.USDC,
        constants.USDC_BRIDGE,
        constants.SWAP_ROUTER,
        constants.USDC_TO_USDCE_POOL,
        constants.USDC_TO_ETH_POOL,
        constants.ETH_PRICE,
        constants.WETH,
      ],
    });

    return data;
  }

  async addPrizeProposal(data: {
    title: string;
    description: string;
    submissionStartDate: string;
    submissionDuration: number;
    votingStartDate: string;
    votingDuration: number;
    imageUrl: string;
    username: string;
    proposerAddress: string;
  }) {
    const slug = stringToSlug(data.title);
    const randomId = nanoid(3);
    const prizeId = await this.db.transaction(async (trx) => {
      const [slugExists] = await trx
        .select({
          slug: prizes.slug,
        })
        .from(prizes)
        .where(eq(prizes.slug, slug))
        .limit(1);
      const [prize] = await trx
        .insert(prizes)
        .values({
          authorUsername: data.username,
          description: data.description,
          imageUrl: data.imageUrl,
          submissionDurationInMinutes: data.submissionDuration,
          startVotingDate: data.votingStartDate,
          title: data.title,
          slug: slugExists ? `${slug}_${randomId}` : slug,
          votingDurationInMinutes: data.votingDuration,
          proposerAddress: data.proposerAddress,
          startSubmissionDate: data.submissionStartDate,
        } as any)

        .returning({
          id: prizes.id,
        });
      return prize?.id;
    });

    return prizeId;
  }
}
