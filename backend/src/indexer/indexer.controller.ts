import { Controller, Post } from "@nestjs/common";

@Controller('indexer')
export class PortalsController {

    @Post('/portal')
    async portalIndex() {
        return 'This action adds a new portal';

    }


}
