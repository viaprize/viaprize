import { Injectable } from "@nestjs/common";
import { InjectTriggerDevClient } from "@trigger.dev/nestjs";
import { DynamicSchedule, TriggerClient } from "@trigger.dev/sdk";
import { BlockchainService } from "src/blockchain/blockchain.service";

@Injectable()
export class JobService {
    dynamicSchedule: DynamicSchedule;
    constructor(@InjectTriggerDevClient() private readonly client: TriggerClient, private readonly blockchainService: BlockchainService) {
        this.dynamicSchedule = client.defineDynamicSchedule({
            id: 'trigger-deadline-portal-dynamic-interval',

        });

        client.defineJob(({
            id: 'trigger-deadline-portal-job',
            name: "Trigger Deadline Portal Job",
            version: "0.0.1",
            trigger: this.dynamicSchedule,

            async run(payload, io, context) {
                await io.logger.info(`contract address is  ${context.source!.id}`);
                try {
                    const receipt = await blockchainService.setEndKickStarterCampaign(context.source!.id);
                    await io.logger.info(`receipt is  ${JSON.stringify(receipt)}`);
                }
                catch (error) {
                    io.logger.error(error.message)
                }
            },

        }))
    }
    async registerPortalDeadlineCronJob(contractAddress: string, schedule: string) {
        //use the userId as the id for the DynamicSchedule
        //so it comes through to run() in the context source.id
        await this.dynamicSchedule.register(contractAddress, {
            type: "cron",
            options: {
                cron: schedule,
            },
        });
    }

}