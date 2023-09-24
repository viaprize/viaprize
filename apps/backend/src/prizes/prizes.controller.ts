import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { PrizeProposalsService } from './services/prizes-proposals.service';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { PrizeProposals } from './entities/prize-proposals.entity';

import { ApiProperty } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { RejectProposalDto } from './dto/reject-proposal.dto';

class PrizeProposalsPaginationResult
  implements InfinityPaginationResultType<PrizeProposals>
{
  data: PrizeProposals[];
  hasNextPage: boolean;
  @ApiProperty({ type: [PrizeProposals] })
  results: PrizeProposals[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

@ApiTags('prizes')
@Controller('prizes')
export class PrizesController {
  constructor(private readonly prizeProposalsService: PrizeProposalsService) {}

  @Get('/proposals')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Get all Pending proposals',
  })
  @ApiResponse({
    status: 200,
    description: 'The proposals were returned successfully',
    type: PrizeProposalsPaginationResult,
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    type: Number,
  })
  @ApiBearerAuth('access-token')
  async getPendingProposals(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return infinityPagination(
      await this.prizeProposalsService.findAllWithPagination({
        page,
        limit,
      }),
      {
        limit,
        page,
      },
    );
  }

  @Post('/proposals')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Proposal of a Prize  by passing Prize data ',
  })
  @ApiBody({
    description: 'Request body to create a prize',
    type: CreatePrizeProposalDto,
  })
  @ApiBearerAuth('access-token')
  create(
    @Body() createPrizeProposalDto: CreatePrizeProposalDto,
    @Request() req,
  ) {
    console.log({ createPrizeProposalDto });
    console.log(req.user, 'user');
    return this.prizeProposalsService.create(
      createPrizeProposalDto,
      req.user.userId,
    );
  }

  @Get('/proposals/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The proposals were returned successfully',
    type: PrizeProposalsPaginationResult,
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    type: Number,
  })
  @ApiParam({
    name: 'userId',
    type: String,
  })
  async getProposalsBy(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param('userId') userId,
  ): Promise<InfinityPaginationResultType<PrizeProposals>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.prizeProposalsService.findByUserWithPagination(
        {
          limit,
          page,
        },
        userId,
      ),
      { page, limit },
    );
  }
  @Get('/proposals/:userId')
  @ApiResponse({
    status: 200,
    description: 'The proposals were returned successfully',
    type: PrizeProposalsPaginationResult,
  })
  @ApiParam({
    name: 'authId',
    type: String,
  })
  async getProposal(@Param('authId') authId: string) {
    return await this.prizeProposalsService.findByUserAuthId(authId);
  }

  @Post('/proposals/reject/:id')
  @ApiResponse({
    status: 200,
    description: 'The Proposals was Rejected',
  })
  @ApiBody({
    description: 'Request body to reject a proposal',
    type: RejectProposalDto,
  })
  @UseGuards(AdminAuthGuard)
  async rejectProposal(
    @Param('id') id: string,
    @Body() rejectProposalDto: RejectProposalDto,
  ) {
    return await this.prizeProposalsService.reject(
      id,
      rejectProposalDto.comment,
    );
  }

  @Post('/proposals/accept/:id')
  @ApiResponse({
    status: 200,
    description: 'The Proposals was Approved',
  })
  @UseGuards(AdminAuthGuard)
  @ApiParam({
    name: 'id',
    type: String,
  })
  async approveProposal(@Param('id') id: string) {
    return await this.prizeProposalsService.approve(id);
  }
}
