import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider } from 'ethers';
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
    return this.provider.getBalance(address);
  }
}
