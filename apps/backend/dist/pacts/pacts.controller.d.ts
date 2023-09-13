import { PactsService } from './pacts.service';
import { CreatePactDto } from './dto/create-pact.dto';
export declare class PactsController {
    private readonly pactsService;
    constructor(pactsService: PactsService);
    create(createPactDto: CreatePactDto, networkType: string): Promise<{
        networkType: string;
        name: string;
        terms: string;
        address: string;
        transactionHash: string;
        blockHash?: string | undefined;
    } & import("./entities/pact.entity").PactEntity>;
    findAll(networkType: string): Promise<import("./entities/pact.entity").PactEntity[]>;
    findOne(address: string): Promise<import("./entities/pact.entity").PactEntity | null>;
}
