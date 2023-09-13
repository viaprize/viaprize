import { Injectable } from '@nestjs/common';
import { BlockchainService } from 'src/blockchain/blockchain.service';

@Injectable()
export class PrizeContract {
  private readonly contractABI = [];
  constructor(private readonly blockchainService: BlockchainService) {}

  async getAdmins(contractAddress: string) {
    return this.blockchainService.callContractFunction(
      contractAddress,
      this.contractABI,
      'getAdmins',
    );
  }

  async getFunders(contractAddress: string) {
    return this.blockchainService.callContractFunction(
      contractAddress,
      this.contractABI,
      'getFunders',
    );
  }
}
