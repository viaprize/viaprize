import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider, ethers } from 'ethers';
import { AllConfigType } from 'src/config/config.type';
@Injectable()
export class BlockchainService {
  provider: JsonRpcProvider;
  wallet: ethers.Wallet;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const key = this.configService.getOrThrow<AllConfigType>('RPC_URL', {
      infer: true,
    });
    const privateKey = this.configService.getOrThrow<AllConfigType>('PRIVATE_KEY', { infer: true });
    this.provider = new JsonRpcProvider(key);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  getBalanceOfAddress(address: string) {
    console.log({ address });
    return this.provider.getBalance(address);
  }
  async setEndKickStarterCampaign(contractAddress: string) {
    const contract = new ethers.Contract(
      contractAddress,
      [
        "function endKickStarterCampaign()",
      ],
      this.wallet,
    );
    try {
      const gasEstimate = await contract.endKickStarterCampaign.estimateGas(
        this.wallet.address,
      );
      const gasLimit = parseInt(gasEstimate.toString()) * 2;
      const tx = await contract.endKickStarterCampaign(this.wallet.address, {
        gasLimit: BigInt(gasLimit),
      });

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {

      return new Error(error);
    }
  }
  async getSubmissionTime(viaprizeContractAddress: string): Promise<bigint> {
    const abi = ['function get_submission_time() view returns (uint256)'];
    const contract = new ethers.Contract(
      viaprizeContractAddress,
      abi,
      this.provider,
    );
    const getSubmissionTime = await contract.get_submission_time();
    return getSubmissionTime;
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

  async isPortalActive(portalContractAddress: string): Promise<boolean> {
    const abi = ['function isActive() view returns (bool)'];
    const contract = new ethers.Contract(
      portalContractAddress,
      abi,
      this.provider,
    );
    return await contract.isActive().catch((e) => {
      console.log(e);
      return false;
    });
  }

  async getIsPrizeDistributed(
    viaprizeContractAddress: string,
  ): Promise<boolean> {
    const abi = ['function distributed() view returns (bool)'];
    const contract = new ethers.Contract(
      viaprizeContractAddress,
      abi,
      this.provider,
    );
    return await contract.distributed().catch((e) => {
      console.log(e);
      return false;
    });
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
