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
import { AuthGuard } from 'src/auth/auth.guard';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { PrizesService } from 'src/prizes/services/prizes.service';
import { UsersService } from 'src/users/users.service';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { AddUsdcFundsDto } from './dto/add-usdc-funds.dto';
import { ChangeSubmissionDto } from './dto/change-submission.dto';
import { ChangeVotingDto } from './dto/change-voting.dto';
import { VoteDTO } from './dto/vote.dto';
import { WalletService } from './wallet.service';

type WalletResponse = {
  hash: string;
};
/**
 * This is the wallet controller class.
 * it handles the gasless transactions
 * @tag {wallet}
 */
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly userService: UsersService,
    private readonly blockchainService: BlockchainService,
    private readonly prizeService: PrizesService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/start_submission')
  async startSubmission(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
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
      const hash =
        await this.walletService.simulateAndWriteSmartContractPrizeV2(
          'startSubmissionPeriod',
          [BigInt(prize.submissionTime)],
          contractAddress,
          'gasless',
          '0',
        );

      return {
        hash,
      };
    } catch (err) {
      console.log({ err }, 'err');
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

  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/end_submission')
  async endSubmission(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
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

    console.log({ submissionPeriod }, 'submission periods');
    try {
      const hash =
        await this.walletService.simulateAndWriteSmartContractPrizeV2(
          'endSubmissionPeriod',
          [],
          contractAddress,
          'gasless',
          '0',
        );
      return {
        hash,
      };
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

  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/start_voting')
  async startVoting(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
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
      const hash =
        await this.walletService.simulateAndWriteSmartContractPrizeV2(
          'startVotingPeriod',
          [BigInt(prize.votingTime)],
          contractAddress,
          'gasless',
          '0',
        );
      return {
        hash,
      };
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

  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/end_voting')
  async endVoting(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
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
      const hash =
        await this.walletService.simulateAndWriteSmartContractPrizeV2(
          'endVotingPeriod',
          [],
          contractAddress,
          'gasless',
          '0',
        );
      return { hash };
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

  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/change_submission')
  async changeSubmission(
    @TypedParam('contract_address') contractAddress: string,
    @Body() body: ChangeSubmissionDto,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
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
      const hash =
        await this.walletService.simulateAndWriteSmartContractPrizeV2(
          'changeSubmissionPeriod',
          [BigInt(body.minutes)],
          contractAddress,
          'gasless',
          '0',
        );

      return {
        hash,
      };
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

  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/change_voting')
  async changeVoting(
    @TypedParam('contract_address') contractAddress: string,
    @Body() body: ChangeVotingDto,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
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
      const hash =
        await this.walletService.simulateAndWriteSmartContractPrizeV2(
          'changeVotingPeriod',
          [BigInt(body.minutes)],
          contractAddress,
          'gasless',
          '0',
        );
      return { hash };
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
  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/end_dispute')
  async endDispute(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const [[disputePeriod]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [contractAddress],
        ['disputePeriod'],
      )) as [[bigint]];
    if (disputePeriod == BigInt(0)) {
      console.log({ disputePeriod });
      throw new HttpException(
        'Dispute period has not started',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const hash =
        await this.walletService.simulateAndWriteSmartContractPrizeV2(
          'endDispute',
          [],
          contractAddress,
          'gasless',
          '0',
        );
      return { hash };
    } catch (err) {
      if (err instanceof BaseError) {
        console.log({ err });
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

  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/end_dispute_early')
  async endEarlyDisputePeriod(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const [[disputePeriod]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [contractAddress],
        ['disputePeriod'],
      )) as [[bigint]];
    if (disputePeriod == BigInt(0)) {
      console.log({ disputePeriod });
      throw new HttpException(
        'Dispute period has not started',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const hash =
        await this.walletService.simulateAndWriteSmartContractPrizeV2(
          'endDisputePeriodEarly',
          [],
          contractAddress,
          'gasless',
          '0',
        );
      return { hash };
    } catch (err) {
      if (err instanceof BaseError) {
        console.log({ err });
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

  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/vote')
  async vote(
    @TypedParam('contract_address') contractAddress: string,
    @Body()
    body: VoteDTO,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
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
      console.log({ body }, 'body');
      const hash =
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
          false,
        );
      return { hash };
    } catch (err) {
      if (err instanceof BaseError) {
        console.log({ err }, 'errrwe');
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

  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/prize/:contract_address/add_usdc_funds')
  async addUsdc(
    @TypedParam('contract_address') contractAddress: string,
    @Body()
    body: AddUsdcFundsDto,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    try {
      const hash =
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
      console.log({ hash });
      return { hash };
    } catch (err) {
      console.log({ err });
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          console.log({ err });
          const errorName = revertError.data?.errorName ?? '';
          throw new HttpException(
            'Error: ' + errorName,
            HttpStatus.BAD_REQUEST,
          );
        } else {
          throw new HttpException(
            'Error: ' + err.message,
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
  /**
   * @security bearer
   **/
  @UseGuards(AuthGuard)
  @Post('/fund_raisers/:contract_address/end_campaign')
  async endCampaign(
    @TypedParam('contract_address') contractAddress: string,
    @Request() req,
  ): Promise<WalletResponse | undefined> {
    const user = this.userService.findOneByAuthId(req.user.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    try {
      const hash =
        await this.walletService.simulateAndWriteSmartContractPassThroughV2(
          'endCampaign',
          [],
          contractAddress,
          'gasless',
          '0',
        );
      return { hash };
    } catch (err) {
      if (err instanceof BaseError) {
        console.log({ err });
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          console.log({ err });
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
