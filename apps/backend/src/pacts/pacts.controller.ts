import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePactDto } from './dto/create-pact.dto';
import { PactsService } from './pacts.service';
@ApiTags('pacts')
@Controller('pacts')
export class PactsController {
  constructor(private readonly pactsService: PactsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Pact by passing pact data and network type',
  })
  @ApiHeader({
    name: 'Network-Type',
    description: 'Write if its testnet or mainnet',
    required: true,
    enum: ['testnet', 'mainnet'],
    example: 'testnet',
  })
  @ApiBody({
    description: 'Request body to create pact',
    type: CreatePactDto,
  })
  create(
    @Body() createPactDto: CreatePactDto,
    @Headers('Network-Type') networkType: string,
  ) {
    return this.pactsService.create(createPactDto, networkType);
  }

  @ApiHeader({
    name: 'Network-Type',
    description: 'Write if its testnet or mainnet',
    required: true,
    enum: ['testnet', 'mainnet'],
    example: 'testnet',
  })
  @ApiOperation({ summary: 'Get all pacts of a network type' })
  @Get()
  findAll(@Headers('Network-Type') networkType: string) {
    return this.pactsService.findAll(networkType);
  }

  @Get(':address')
  findOne(@Param('address') address: string) {
    return this.pactsService.findOne(address);
  }
}
