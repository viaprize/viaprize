import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TriggerDevModule } from '@trigger.dev/nestjs';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { JobService } from './jobs.service';

@Module({
    providers: [JobService],
    imports: [TriggerDevModule.registerAsync({
        useFactory: (configService: ConfigService) => ({
            id: 'viaprize-prod',
            apiKey: configService.get<string>("TRIGGER_API_KEY"),
            apiUrl: configService.get<string>("TRIGGER_API_URL"),
        }),
        inject: [ConfigService],
    }), BlockchainModule],
    exports: [JobService],
})
export class JobsModule {
}
