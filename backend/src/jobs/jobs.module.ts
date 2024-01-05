import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TriggerDevModule } from '@trigger.dev/nestjs';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { JobController } from './jobs.controller';
import { JobService } from './jobs.service';

@Module({
    providers: [JobService],
    controllers: [JobController],
    imports: [TriggerDevModule.registerAsync({
        useFactory: (configService: ConfigService) => {
            console.log(configService.get<string>("TRIGGER_API_KEY"), "hiiiiiiiiiiiiiiiiiiiiiii")
            return ({
                id: 'viaprize-prod',
                apiKey: configService.get<string>("TRIGGER_API_KEY"),
                apiUrl: "https://cloud.trigger.dev",


            })
        },
        inject: [ConfigService],

    }), BlockchainModule],
    exports: [JobService],
})
export class JobsModule {
}
