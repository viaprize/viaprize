import { TypedParam } from '@nestia/core';
import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { PrizesService } from 'src/prizes/services/prizes.service';
import { UsersService } from 'src/users/users.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly userService: UsersService,
    private readonly blockchainService: BlockchainService,
    private readonly prizeService: PrizesService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/start_submission')
  async startSubmission(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ) {
    const user = this.userService.findOneByAuthId(req.user.userId);
    const [[submissionPeriod, submissionTime]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [contractAddress],
        ['submissionPeriod', 'getSubmissionTime'],
      )) as [[boolean, number]];
    if (submissionPeriod) {
      throw new HttpException(
        'Submission period has already started',
        HttpStatus.BAD_REQUEST,
      );
    }
    const prize = await this.prizeService
      .findPrizeByContractAddress(contractAddress)
      .catch(() => {
        throw new HttpException('Prize does not exist', HttpStatus.BAD_REQUEST);
      });
  }
}
