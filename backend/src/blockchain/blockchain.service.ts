import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractAbiFunctionNames } from 'abitype';
import { AllConfigType } from 'src/config/config.type';
import { PASS_THROUGH_ABI, PRIZE_V2_ABI } from 'src/utils/constants';
import {
  MulticallReturnType,
  PublicClient,
  createPublicClient,
  encodeFunctionData,
  http,
  parseAbi,
} from 'viem';
import { base } from 'viem/chains';
import {
  Contribution,
  Contributions,
  TransactionApiResponse,
} from './blockchain';

function splitArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}
@Injectable()
export class BlockchainService {
  provider: PublicClient;
  multiCallContract = {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11' as `0x${string}`,
    abi: parseAbi([
      'function getEthBalance(address addr) view returns (uint256 balance)',
    ] as const),
  } as const;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const key = this.configService.getOrThrow<AllConfigType>('RPC_URL', {
      infer: true,
    });
    // const privateKey = this.configService.getOrThrow<AllConfigType>('PRIVATE_KEY', { infer: true });
    this.provider = createPublicClient({
      chain: base,
      transport: http(key),
    });
    // this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  getBalanceOfAddress(address: string) {
    console.log({ address });
    return this.provider.getBalance({
      address: address as `0x${string}`,
    });
  }
  async getVotingTime(viaprizeContractAddress: string): Promise<bigint> {
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'get_voting_time',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
      },
    ] as const;
    const data = await this.provider.readContract({
      abi,
      address: viaprizeContractAddress as `0x${string}`,
      functionName: 'get_voting_time',
    });
    return data;
  }

  async isPortalActive(portalContractAddress: string): Promise<boolean> {
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'isActive',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      },
    ] as const;
    const data = await this.provider
      .readContract({
        abi,
        address: portalContractAddress as `0x${string}`,
        functionName: 'isActive',
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
    return data;
  }

  async getIsPrizeDistributed(
    viaprizeContractAddress: string,
  ): Promise<boolean> {
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'distributed',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      },
    ] as const;
    const data = await this.provider
      .readContract({
        address: viaprizeContractAddress as `0x${string}`,
        abi: abi,
        functionName: 'distributed',
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
    return data;
  }

  async getTotalRewardsOfPortal(
    portalContractAddress: string,
  ): Promise<bigint> {
    const abi = [
      {
        constant: true,
        inputs: [],
        name: 'totalRewards',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ] as const;
    const data = this.provider.readContract({
      address: portalContractAddress as `0x${string}`,
      abi,
      functionName: 'totalRewards',
    });

    return data;
  }
  async getTotalFundsOfPortal(portalContractAddress: string): Promise<bigint> {
    const abi = [
      {
        constant: true,
        inputs: [],
        name: 'totalFunds',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ] as const;
    const data = this.provider.readContract({
      address: portalContractAddress as `0x${string}`,
      abi: abi,
      functionName: 'totalFunds',
    });

    return data;
  }

  async getPortalsPublicVariables(portalContractAddress: string[]) {
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'isActive',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      },
      {
        constant: true,
        inputs: [],
        name: 'totalFunds',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalRewards',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ] as const;

    const calls: any = [];
    portalContractAddress.forEach((address) => {
      const wagmiContract = {
        address: address as `0x${string}`,
        abi: abi,
      } as const;
      calls.push(
        {
          ...this.multiCallContract,
          functionName: 'getEthBalance',
          args: [address as `0x${string}`],
        },
        {
          ...wagmiContract,
          functionName: 'totalFunds',
        },
        {
          ...wagmiContract,
          functionName: 'totalRewards',
        },
        {
          ...wagmiContract,
          functionName: 'isActive',
        },
      );
    });

    const results = await this.provider.multicall({
      contracts: calls,
    });

    return results;
  }

  async getPortalContributors(
    portalContractAddress: string,
  ): Promise<Contributions> {
    const etherscanApiKey = this.configService.getOrThrow<AllConfigType>(
      'ETHERSCAN_API_KEY',
      {
        infer: true,
      },
    );

    // const fetchUrl = `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${portalContractAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const fetchUrl = `https://api.basescan.org/api?module=account&action=tokentx&contractaddress=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&address=${portalContractAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${etherscanApiKey}`;
    const res = await fetch(fetchUrl);
    console.log(fetchUrl, 'url');
    const result = (await res.json()) as TransactionApiResponse;

    const contributions: Contributions = {
      data: result.result
        .map((transaction) => {
          if (
            transaction.isError !== '1' &&
            transaction.to == portalContractAddress
          ) {
            return {
              contributor: transaction.from,
              amount: transaction.value,
              donationTime: transaction.timeStamp,
            };
          } else {
            return null;
          }
        })
        .filter((transaction) => transaction !== null) as Contribution[],
    };

    console.log(contributions, 'contributions');

    return contributions;
  }

  async getPortalPublicVariables(portalContractAddress: string) {
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'isActive',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      },
      {
        constant: true,
        inputs: [],
        name: 'totalFunds',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalRewards',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ] as const;

    const wagmiContract = {
      address: portalContractAddress as `0x${string}`,
      abi: abi,
    } as const;
    const results = await this.provider.multicall({
      contracts: [
        {
          ...this.multiCallContract,
          functionName: 'getEthBalance',
          args: [portalContractAddress as `0x${string}`],
        },
        {
          ...wagmiContract,
          functionName: 'totalFunds',
        },
        {
          ...wagmiContract,
          functionName: 'totalRewards',
        },
        {
          ...wagmiContract,
          functionName: 'isActive',
        },
      ],
    });
    return results;
  }

  async getPassThroughPublicVariables<T extends any>(
    passThroughtContractAddresses: string[],
    variables: ExtractAbiFunctionNames<
      typeof PASS_THROUGH_ABI,
      'pure' | 'view'
    >[],
  ): Promise<T[][]> {
    const calls: any = [];
    passThroughtContractAddresses.forEach((address) => {
      const wagmiContract = {
        address: address as `0x${string}`,
        abi: PASS_THROUGH_ABI,
      } as const;
      const contracts = variables.map((variable) => {
        return {
          ...wagmiContract,
          functionName: variable,
        };
      });
      calls.push(...contracts);
    });
    const results: MulticallReturnType<any, true> =
      await this.provider.multicall({
        contracts: calls,
      });
    const final_results_unsliced = results.map((result) => {
      if (result.error) {
        throw new Error(result.error);
      }
      return result.result;
    });

    const final = splitArray(final_results_unsliced, variables.length);

    console.log({ final });
    return final as never as T[][];
  }

  async getPrizesV2PublicVariables<T extends any>(
    prizeContractAddresses: string[],
    variables: ExtractAbiFunctionNames<typeof PRIZE_V2_ABI, 'pure' | 'view'>[],
  ): Promise<T[][]> {
    const calls: any = [];
    prizeContractAddresses.forEach((address) => {
      const wagmiContract = {
        address: address as `0x${string}`,
        abi: PRIZE_V2_ABI,
      } as const;
      const contracts = variables.map((variable) => {
        return {
          ...wagmiContract,
          functionName: variable,
        };
      });
      calls.push(...contracts);
    });
    const results: MulticallReturnType<any, true> =
      await this.provider.multicall({
        contracts: calls,
      });
    const final_results_unsliced = results.map((result) => {
      if (result.error) {
        throw new Error(result.error);
      }
      return result.result;
    });

    const final = splitArray(final_results_unsliced, variables.length);

    console.log({ final });
    return final as never as T[][];
  }

  async getSubmissionHashFromTransactionPrizeV2(hash: string) {
    const reciept = await this.provider.waitForTransactionReceipt({
      hash: hash as `0x${string}`,
      confirmations: 1,
    });
    console.log({ reciept });
    return reciept.logs[1].topics[2];
  }

  async getPrizeV2FunctionEncoded(
    functionName: ExtractAbiFunctionNames<
      typeof PRIZE_V2_ABI,
      'pure' | 'view' | 'nonpayable' | 'payable'
    >,
    args: any[],
  ) {
    const data = encodeFunctionData({
      abi: PRIZE_V2_ABI,
      functionName: functionName,
      args: args as any,
    });
    return data;
  }
}
