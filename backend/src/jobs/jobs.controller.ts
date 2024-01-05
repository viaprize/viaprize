import { Controller, Get } from "@nestjs/common";
import { JobService } from "./jobs.service";

@Controller()
export class JobController {
    constructor(private jobService: JobService) { }


    @Get()
    getHello(): string {
        return `Running Trigger.dev with client-id ${this.jobService.dynamicSchedule.id}`;
    }




}
