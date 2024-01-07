import { Module } from '@nestjs/common';

import { JobService } from './jobs.service';

@Module({
    providers: [JobService],
    exports: [JobService],
})
export class JobsModule {
}
