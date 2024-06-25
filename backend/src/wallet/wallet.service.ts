import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractAbiFunctionNames } from 'abitype';
import { AllConfigType } from 'src/config/config.type';
import {
  Abi,
  ContractFunctionArgs,
  ContractFunctionName,
  PublicClient,
  createPublicClient,
  encodeFunctionData,
  http,
} from 'viem';

import { JobService } from 'src/jobs/jobs.service';
import { base } from 'viem/chains';
import { PRIZE_V2_ABI } from '../utils/constants';

export type WalletType = 'gasless' | 'reserve';
@Injectable()
export class WalletService {
  apiKey: string;
  walletApiUrl: string;
  provider: PublicClient;
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jobsService: JobService,
  ) {
    this.apiKey = this.configService.getOrThrow<AllConfigType>(
      'GASLESS_API_KEY',
      { infer: true },
    );
    this.walletApiUrl = this.configService.getOrThrow<AllConfigType>(
      'WALLET_API_URL',
      {
        infer: true,
      },
    );
    this.provider = createPublicClient({
      chain: base,
      transport: http(
        this.configService.getOrThrow<AllConfigType>('RPC_URL', {
          infer: true,
        }),
      ),
    });
  }

  async simulateSmartContract<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  >(
    abi,
    functionName: ExtractAbiFunctionNames<typeof abi, 'payable' | 'nonpayable'>,
    args: ContractFunctionArgs<
      abi,
      'payable' | 'nonpayable',
      typeof functionName
    >,
    contractAddress: string,
    type: WalletType,
  ) {
    const walletAddress = await this.getAddress(type);
    console.log({ walletAddress });
    const result = await this.provider.simulateContract({
      address: contractAddress as `0x${string}`,
      abi: abi,
      functionName: functionName,
      args: args as readonly unknown[],
      account: walletAddress as `0x${string}`,
    });
    return result;
  }

  async writeSmartContract<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  >(
    abi,
    functionName: ExtractAbiFunctionNames<typeof abi, 'payable' | 'nonpayable'>,
    args: ContractFunctionArgs<
      abi,
      'payable' | 'nonpayable',
      typeof functionName
    >,
    contractAddress: string,
    type: WalletType,
    value: string,
  ) {
    const contractCallData = encodeFunctionData({
      abi: abi,
      functionName: functionName,
      args: args as any[],
    });
    const transaction = {
      to: contractAddress,
      data: contractCallData,
      value,
    };
    console.log({ transaction });
    const transactionHash = await this.sendTransaction(transaction, type);
    console.log(transactionHash);
    return transactionHash;
  }

  async simulateAndWriteSmartContractPrizeV2<
    const abi extends typeof PRIZE_V2_ABI | readonly unknown[],
    functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
    args extends ContractFunctionArgs<
      abi,
      'nonpayable' | 'payable',
      functionName
    > = ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  >(
    functionName: ContractFunctionName<abi, 'payable' | 'nonpayable'>,
    args:
      | ContractFunctionArgs<abi, 'payable' | 'nonpayable', functionName>
      | [`0x${string}`, bigint, bigint, `0x${string}`, `0x${string}`],
    contractAddress: string,
    type: WalletType,
    value: string,
    simulate = true,
  ) {
    if (simulate) {
      await this.simulateSmartContract(
        PRIZE_V2_ABI,
        functionName,
        args as readonly unknown[],
        contractAddress,
        type,
      );
    }
    const transactionHash = await this.writeSmartContract(
      PRIZE_V2_ABI,
      functionName,
      args as readonly unknown[],
      contractAddress,
      type,
      value,
    );
    console.log({ transactionHash });
    return transactionHash;
  }

  async getAddress(type: WalletType) {
    return fetch(`${this.walletApiUrl}/${type}/address`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => res.address as string);
  }
  async scheduleTransaction(
    transaction: {
      to: string;
      data: string;
      value: string;
    },
    type: WalletType,
    scheduleInSeconds: number,
    title,
  ) {
    console.log({ scheduleInSeconds });
    return await this.jobsService.registerJobV2(
      `${this.walletApiUrl}/${type}`,
      transaction,
      {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'x-chain-id': '8453',
      },
      scheduleInSeconds,
    );
  }
  async sendTransaction(
    transaction: {
      to: string;
      data: string;
      value: string;
    },
    type: WalletType,
  ) {
    const transactionHash = await (
      await fetch(`${this.walletApiUrl}/${type}`, {
        body: JSON.stringify(transaction),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'x-chain-id': '8453',
        },
        method: 'POST',
      })
    )
      .json()
      .then((res) => {
        console.log({ res });
        return res.hash as string;
      });
    return transactionHash;
  }
}
