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
    return await contract.get_submission_time();
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
