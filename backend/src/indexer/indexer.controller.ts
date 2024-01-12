import { Controller, Post } from '@nestjs/common';

@Controller('indexer')
export class PortalsController {
  @Post('/portal')
  portalIndex() {
    return 'This action adds a new portal';
  }
}
