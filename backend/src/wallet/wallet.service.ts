import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
@Injectable()
export class WalletService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}
}
