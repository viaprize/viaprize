import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpStatus,
} from '@nestjs/common';
import { PrizeProposalsService } from './services/prizes-proposals.service';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';

import {
  ApiOperation,
  ApiHeader,
  ApiBody,
  ApiResponse,
  getSchemaPath,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { PrizeProposals } from './entities/prize-proposals.entity';
import { infinityPagination } from 'src/utils/infinity-pagination';

import { ApiProperty } from '@nestjs/swagger';

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

  @Post('/proposals')
  @ApiOperation({
    summary: 'Proposal of a Prize  by passing Prize data ',
  })
  @ApiBody({
    description: 'Request body to create a prize',
    type: CreatePrizeProposalDto,
  })
  create(@Body() createPrizeProposalDto: CreatePrizeProposalDto) {
    return this.prizeProposalsService.create(createPrizeProposalDto);
  }

  @Get('/proposals/proposer_address/:address')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The proposals were returned successfully',
    type: PrizeProposalsPaginationResult,
  })
  @ApiParam({
    name: 'address',
    type: String,
  })
  async getProposalsBy(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param('address') address,
  ): Promise<InfinityPaginationResultType<PrizeProposals>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.prizeProposalsService.findByProposerAddressWithPagination(
        {
          limit,
          page,
        },
        address,
      ),
      { page, limit },
    );
  }
  @Get('/proposals/:id')
  @ApiResponse({
    status: 200,
    description: 'The proposals were returned successfully',
    type: PrizeProposalsPaginationResult,
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  async getProposal(@Param('id') id: string) {
    return await this.prizeProposalsService.findOne(id);
  }
}
