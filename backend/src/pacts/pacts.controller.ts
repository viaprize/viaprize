import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { CreatePact } from './dto/create-pact.dto';
import { Pact } from './entities/pact.entity';
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
  create(@TypedBody() createPact: CreatePact): Promise<Pact> {
    return this.pactsService.create(createPact);
  }

  /**
   * @summary Get all pacts of application
   *
   * @see {Pact}
   * @returns {Promise<Pact[]>} Returns all pacts
   */

  findAll(): Promise<Pact[]> {
    return this.pactsService.findAll();
  }

  /**
   * @summary Get all pacts of application
   *
   * @see {Pact}
   * @returns {Promise<Pact[]>} Returns all pacts
   */
  @TypedRoute.Get(':address')
  findOne(@TypedParam('address') address: string) {
    return this.pactsService.findOne(address);
  }
}
