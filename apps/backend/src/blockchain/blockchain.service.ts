import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      'https://opt-mainnet.g.alchemy.com/v2/224qz7e8XHRyAkY6AXLYHhGB9cPxeuYG',
    );
  }

  async getBalance(address: string): Promise<bigint> {
    return this.provider.getBalance(address);
  }

  async callContractFunction(
    contractAddress: string,
    contractABI: any[],
    functionName: string,
    ...args: any[]
  ): Promise<any> {
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      this.provider,
    );
    return contract[functionName](...args);
  }
}
