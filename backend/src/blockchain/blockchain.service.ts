import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider, ethers } from 'ethers';
import { AllConfigType } from 'src/config/config.type';
@Injectable()
export class BlockchainService {
  provider: JsonRpcProvider;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const key = this.configService.getOrThrow<AllConfigType>('RPC_URL', {
      infer: true,
    });
    this.provider = new JsonRpcProvider(key);
  }

  getBalanceOfAddress(address: string) {
    console.log({ address });
    return this.provider.getBalance(address);
  }

  async getSubmissionTime(viaprizeContractAddress: string): Promise<bigint> {
    const abi = ['function get_submission_time() view returns (uint256)'];
    const contract = new ethers.Contract(
      viaprizeContractAddress,
      abi,
      this.provider,
    );
    const totalFunds = await contract.totalRewards();
    return totalFunds;
  }

  async getVotingTime(viaprizeContractAddress: string): Promise<bigint> {
    const abi = ['function get_voting_time() view returns (uint256)'];
    const contract = new ethers.Contract(
      viaprizeContractAddress,
      abi,
      this.provider,
    );
    return await contract.get_voting_time();
  }

  async getTotalRewardsOfPortal(
    portalContractAddress: string,
  ): Promise<bigint> {
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
    ];
    const contract = new ethers.Contract(
      portalContractAddress,
      abi,
      this.provider,
    );
    console.log(contract);
    return await contract.totalRewards();
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
    ];
    const contract = new ethers.Contract(
      portalContractAddress,
      abi,
      this.provider,
    );
    console.log(contract);
    return await contract.totalFunds();
  }

  async getSubmissionVotes(
    viaprizeContractAddress: string,
    hash: string,
  ): Promise<bigint> {
    const abi = [
      'function get_submission_by_hash(bytes32 submissionHash) view returns (uint256)',
    ];
    const contract = new ethers.Contract(
      viaprizeContractAddress,
      abi,
      this.provider,
    );
    return await contract.get_submission_by_hash(hash);
  }
}
