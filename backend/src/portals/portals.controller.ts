import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PortalsService } from './portals.service';
import { CreatePortalDto } from './dto/create-portal.dto';
import { UpdatePortalDto } from './dto/update-portal.dto';

@Controller('portals')
export class PortalsController {
  constructor(private readonly portalsService: PortalsService) {}

  @Post()
  create(@Body() createPortalDto: CreatePortalDto) {
    return this.portalsService.create(createPortalDto);
  }

  @Get()
  findAll() {
    return this.portalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portalsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePortalDto: UpdatePortalDto) {
    return this.portalsService.update(+id, updatePortalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.portalsService.remove(+id);
  }
}
