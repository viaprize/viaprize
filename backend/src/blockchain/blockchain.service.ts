import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { AllConfigType } from 'src/config/config.type';
import { PublicClient, createPublicClient, http, parseAbi } from 'viem';
import { optimism } from 'viem/chains';
@Injectable()
export class BlockchainService {
  provider: PublicClient;
  wallet: ethers.Wallet;
  multiCallContract = {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11' as `0x${string}`,
    abi: parseAbi(['function getEthBalance(address addr) view returns (uint256 balance)'] as const),
  } as const;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const key = this.configService.getOrThrow<AllConfigType>('RPC_URL', {
      infer: true,
    });
    // const privateKey = this.configService.getOrThrow<AllConfigType>('PRIVATE_KEY', { infer: true });
    this.provider = createPublicClient({
      chain: optimism,
      transport: http(key),
    })
    // this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  getBalanceOfAddress(address: string) {
    console.log({ address });
    return this.provider.getBalance({
      address: address as `0x${string}`,
    });
  }
  // async setEndKickStarterCampaign(contractAddress: string) {
  //   const contract = new ethers.Contract(
  //     contractAddress,
  //     [
  //       "function endKickStarterCampaign()",
  //     ],
  //     this.wallet,
  //   );
  //   try {
  //     const gasEstimate = await contract.endKickStarterCampaign.estimateGas(
  //       this.wallet.address,
  //     );
  //     const gasLimit = parseInt(gasEstimate.toString()) * 2;
  //     const tx = await contract.endKickStarterCampaign(this.wallet.address, {
  //       gasLimit: BigInt(gasLimit),
  //     });

  //     const receipt = await tx.wait();

  //     return receipt;
  //   } catch (error) {

  //     return new Error(error);
  //   }
  // }
  async getSubmissionTime(viaprizeContractAddress: string): Promise<bigint> {
    const abi = [{
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'get_submission_time',
      outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    }] as const;
    const data = await this.provider.readContract(
      {
        abi,
        address: viaprizeContractAddress as `0x${string}`,
        functionName: 'get_submission_time'
      }
    );

    return data;
  }

  async getVotingTime(viaprizeContractAddress: string): Promise<bigint> {
    const abi = [{
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'get_voting_time',
      outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    }] as const;
    const data = await this.provider.readContract({
      abi,
      address: viaprizeContractAddress as `0x${string}`,
      functionName: 'get_voting_time'
    });
    return data;
  }

  async isPortalActive(portalContractAddress: string): Promise<boolean> {
    const abi = [{
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'isActive',
      outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    }] as const;
    const data = await this.provider.readContract({
      abi,
      address: portalContractAddress as `0x${string}`,
      functionName: 'isActive'
    }).catch((e) => {
      console.log(e);
      return false;
    });
    return data;
  }



  async getIsPrizeDistributed(
    viaprizeContractAddress: string,
  ): Promise<boolean> {
    const abi = [{
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'distributed',
      outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    }] as const;
    const data = await this.provider.readContract({
      address: viaprizeContractAddress as `0x${string}`,
      abi: abi,
      functionName: 'distributed'
    }).catch((e) => {
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
    })

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
      }
    ] as const;
    const data = this.provider.readContract({
      address: portalContractAddress as `0x${string}`,
      abi: abi,
      functionName: 'totalFunds'
    });


    return data;
  }

  async getSubmissionVotes(
    viaprizeContractAddress: string,
    hash: string,
  ): Promise<bigint> {
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [{ name: 'submissionHash', internalType: 'bytes32', type: 'bytes32' }],
        name: 'get_submission_by_hash',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
      }
    ] as const;
    const data = await this.provider.readContract({
      address: viaprizeContractAddress as `0x${string}`,
      abi,
      args: [hash as `0x${string}`],
      functionName: 'get_submission_by_hash'
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

    let calls: any = [];
    portalContractAddress.forEach((address) => {
      const wagmiContract = {
        address: address as `0x${string}`,
        abi: abi,
      } as const;
      calls.push(
        {
          ...this.multiCallContract,
          functionName: 'getEthBalance',
          args: [address as `0x${string}`]
        },
        {
          ...wagmiContract,
          functionName: 'totalFunds'
        },
        {
          ...wagmiContract,
          functionName: 'totalRewards'
        },
        {
          ...wagmiContract,
          functionName: 'isActive'
        }
      )
    })

    const results = await this.provider.multicall({
      contracts: calls,
    });

    return results;
  }

  async getPrizesPublicVariables(prizeAddresses: string[]) {

    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'distributed',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      }
    ]
    let calls: any = [];
    prizeAddresses.forEach((address) => {
      const wagmiContract = {
        address: address as `0x${string}`,
        abi: abi,
      } as const;
      calls.push(
        {
          ...this.multiCallContract,
          functionName: 'getEthBalance',
          args: [address as `0x${string}`]
        },
        {
          ...wagmiContract,
          functionName: 'distributed'
        }
      )
    })
    const results = await this.provider.multicall({
      contracts: calls,
    });
    return results;
  }

  async getPrizePublicVariables(prizeContractAddress: string) {
    const abi = [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'get_voting_time',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
      },
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'get_submission_time',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
      },
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'distributed',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      }
    ]
    const wagmiContract = {
      address: prizeContractAddress as `0x${string}`,
      abi: abi,
    } as const;
    const results = await this.provider.multicall({
      contracts: [
        {
          ...this.multiCallContract,
          functionName: 'getEthBalance',
          args: [prizeContractAddress as `0x${string}`]

        },
        {
          ...wagmiContract,
          functionName: 'get_submission_time'
        },
        {
          ...wagmiContract,
          functionName: 'get_voting_time'
        },
        {
          ...wagmiContract,
          functionName: 'distributed'
        },


      ],
    });
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
          args: [portalContractAddress as `0x${string}`]
        },
        {
          ...wagmiContract,
          functionName: 'totalFunds'
        },
        {
          ...wagmiContract,
          functionName: 'totalRewards'
        },
        {
          ...wagmiContract,
          functionName: 'isActive'
        }
      ],
    });

    return results;
  }



}
