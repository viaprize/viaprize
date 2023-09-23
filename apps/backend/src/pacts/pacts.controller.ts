import {
  Controller,
  Get,

  Body,

  Param,

  Headers,
} from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import { PactsService } from './pacts.service';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
} from '@nestjs/swagger';
import { CreatePact } from './dto/create-pact.dto';



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
  create(
    @TypedBody() createPact: CreatePact,
  ) {
    return this.pactsService.create(createPact);
  }

  @ApiOperation({ summary: 'Get all pacts of a network type' })
  @Get()
  findAll(@Headers('  Network-Type') networkType: string) {
    return this.pactsService.findAll(networkType);
  }

  @Get(':address')
  findOne(@Param('address') address: string) {
    return this.pactsService.findOne(address);
  }
}
