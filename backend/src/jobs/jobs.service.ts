import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "src/config/config.type";
// import { BlockchainService } from "src/blockchain/blockchain.service";

// Date / time(in job’s time zone) after which the job expires, i.e.after which it is not scheduled anymore(format: YYYYMMDDhhmmss, 0 = does not expire)
interface JobSchedule {
    // Schedule time zone
    expiresAt: number; // Date/time after which the job expires, 0 = does not expire
    hours: number[]; // Hours in which to execute the job (0-23; [-1] = every hour)
    mdays: number[]; // Days of month in which to execute the job (1-31; [-1] = every day of month)
    minutes: number[]; // Minutes in which to execute the job (0-59; [-1] = every minute)
    months: number[]; // Months in which to execute the job (1-12; [-1] = every month)
    wdays: number[]; // Days of week in which to execute the job (0=Sunday - 6=Saturday; [-1] = every day of week)
}

interface Job {
    url: string;
    enabled: boolean;
    saveResponses: boolean;
    schedule: JobSchedule;
}

interface CronJobRequest {
    job: Job;
}

@Injectable()
export class JobService {
    // dynamicSchedule: DynamicSchedule;
    apiKey: string;
    constructor(private configService: ConfigService<AllConfigType>) {
        this.apiKey = this.configService.getOrThrow<AllConfigType>('CRON_JOB_API_KEY', { infer: true });
        console.log("api_keyyyy", this.apiKey)

    }
    async registerJob(url: string, title: string, schedule: JobSchedule, headers: { [key: string]: string }, body: any) {
        //use the userId as the id for the DynamicSchedule
        //so it comes through to run() in the context source.id
        fetch('https://api.cron-job.org/jobs', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                job: {
                    url: url,
                    title: title,
                    enabled: true,
                    saveResponses: true,
                    schedule: {
                        timezone: "UTC",
                        ...schedule
                    },
                    extendedData: {
                        headers: headers,
                        body: JSON.stringify(body)

                    },
                    requestMethod: 1
                }
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

    }


    async registerJobForEndKickStarterCampaign(contractAddress: string, schedule: JobSchedule) {
        const anonKey = this.configService.getOrThrow<AllConfigType>('SUPABASE_ANON_API_KEY', { infer: true });
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${anonKey}`
        }
        const body = {
            "contractAddress": contractAddress
        }
        this.registerJob("https://uofqdqrrquswprylyzby.supabase.co/functions/v1/trigger-deadline", contractAddress, schedule, headers, body)
    }

}