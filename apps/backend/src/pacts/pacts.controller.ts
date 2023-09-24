import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePact } from './dto/create-pact.dto';
import { PactsService } from './pacts.service';

/**
 * This is the pacts controller class.
 * it handles the documentation of routes and implementation of services related to the pacts route.
 * @tag {pacts}
 */
@Controller('pacts')
export class PactsController {
  constructor(private readonly pactsService: PactsService) {}

  /**
   * @summary Create Pact by passing pact data
   * @param {CreateUser} createUserType - The user creation Interface.
   * @see {CreatePact}
   * @returns {Promise<Pact>} The created pact object.
   */
  @TypedRoute.Post()
  create(@TypedBody() createPact: CreatePact) {
    return this.pactsService.create(createPact);
  }

  @ApiOperation({ summary: 'Get all pacts of a network type' })
  @Get()
  findAll() {
    return this.pactsService.findAll();
  }

  @Get(':address')
  findOne(@Param('address') address: string) {
    return this.pactsService.findOne(address);
  }
}
