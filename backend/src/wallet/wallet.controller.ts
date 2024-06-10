import { TypedParam } from '@nestia/core';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { AllConfigType } from 'src/config/config.type';
import { PrizesService } from 'src/prizes/services/prizes.service';
import { UsersService } from 'src/users/users.service';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly userService: UsersService,
    private readonly blockchainService: BlockchainService,
    private readonly prizeService: PrizesService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly walletService: WalletService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/start_submission')
  async startSubmission(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ) {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const [[submissionPeriod]] =
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

    try {
      await this.walletService.simulateAndWriteSmartContractPrizeV2(
        'startSubmissionPeriod',
        [BigInt(prize.submissionTime)],
        contractAddress,
        'gasless',
        '0',
      );
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? '';
          throw new HttpException(
            'Error: ' + errorName,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'Error: ' + err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/end_submission')
  async endSubmission(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ) {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const [[submissionPeriod]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [contractAddress],
        ['submissionPeriod'],
      )) as [[boolean]];
    if (!submissionPeriod) {
      throw new HttpException(
        'Submission period has not started',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.walletService.simulateAndWriteSmartContractPrizeV2(
        'endSubmissionPeriod',
        [],
        contractAddress,
        'gasless',
        '0',
      );
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? '';
          throw new HttpException(
            'Error: ' + errorName,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'Error: ' + err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/start_voting')
  async startVoting(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ) {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const prize = await this.prizeService
      .findPrizeByContractAddress(contractAddress)
      .catch(() => {
        throw new HttpException('Prize does not exist', HttpStatus.BAD_REQUEST);
      });
    const [[votingPeriod]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [contractAddress],
        ['votingPeriod'],
      )) as [[boolean]];
    if (votingPeriod) {
      throw new HttpException(
        'Voting period has already started',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.walletService.simulateAndWriteSmartContractPrizeV2(
        'startVotingPeriod',
        [BigInt(prize.votingTime)],
        contractAddress,
        'gasless',
        '0',
      );
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? '';
          throw new HttpException(
            'Error: ' + errorName,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'Error: ' + err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/end_voting')
  async endVoting(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ) {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const [[votingPeriod]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [contractAddress],
        ['votingPeriod'],
      )) as [[boolean]];
    if (!votingPeriod) {
      throw new HttpException(
        'Voting period has not started',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.walletService.simulateAndWriteSmartContractPrizeV2(
        'endVotingPeriod',
        [],
        contractAddress,
        'gasless',
        '0',
      );
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? '';
          throw new HttpException(
            'Error: ' + errorName,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'Error: ' + err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/increase_submission')
  async increaseSubmission(
    @TypedParam('contract_address') contractAddress: string,
    @Body() body: { minutes: string },
    @Request() req,
  ) {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const [[submissionPeriod, votingPeriod]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [contractAddress],
        ['submissionPeriod', 'votingPeriod'],
      )) as [[boolean, boolean]];
    if (!submissionPeriod) {
      throw new HttpException(
        'Submission period has not started',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (votingPeriod) {
      throw new HttpException(
        'Voting period has already started',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.walletService.simulateAndWriteSmartContractPrizeV2(
        'increaseSubmissionPeriod',
        [BigInt(body.minutes)],
        contractAddress,
        'gasless',
        '0',
      );
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? '';
          throw new HttpException(
            'Error: ' + errorName,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'Error: ' + err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/increase_voting')
  async increaseVoting(
    @TypedParam('contract_address') contractAddress: string,
    @Body() body: { minutes: string },
    @Request() req,
  ) {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const [[votingPeriod]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [contractAddress],
        ['votingPeriod'],
      )) as [[boolean, boolean]];
    if (!votingPeriod) {
      throw new HttpException(
        'Voting period has not started',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.walletService.simulateAndWriteSmartContractPrizeV2(
        'increaseVotingPeriod',
        [BigInt(body.minutes)],
        contractAddress,
        'gasless',
        '0',
      );
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? '';
          throw new HttpException(
            'Error: ' + errorName,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'Error: ' + err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/vote')
  async vote(
    @TypedParam('contract_address') contractAddress: string,
    @Body()
    body: {
      submissionHash: string;
      v: number;
      s: string;
      r: string;
      amount: number;
    },
    @Request() req,
  ) {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const [[votingPeriod]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [contractAddress],
        ['votingPeriod'],
      )) as [[boolean]];
    if (!votingPeriod) {
      throw new HttpException(
        'Voting period has not started',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.walletService.simulateAndWriteSmartContractPrizeV2(
        'vote',
        [
          body.submissionHash as `0x${string}`,
          BigInt(body.amount),
          BigInt(body.v),
          body.s as `0x${string}`,
          body.r as `0x${string}`,
        ],
        contractAddress,
        'gasless',
        '0',
      );
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? '';
          throw new HttpException(
            'Error: ' + errorName,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'Error: ' + err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/add_usdc_funds')
  async addUsdc(
    @TypedParam('contract_address') contractAddress: string,
    @Body()
    body: {
      amount: number;
      deadline: number;
      v: number;
      s: string;
      r: string;
      hash: string;
    },
    @Request() req,
  ) {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.walletService.simulateAndWriteSmartContractPrizeV2(
        'addUsdcFunds',
        [
          contractAddress as `0x${string}`,
          BigInt(body.amount),
          BigInt(body.deadline),
          body.v,
          body.s as `0x${string}`,
          body.r as `0x${string}`,
          body.hash as `0x${string}`,
        ],
        contractAddress,
        'gasless',
        '0',
      );
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? '';
          throw new HttpException(
            'Error: ' + errorName,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          'Error: ' + err.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
