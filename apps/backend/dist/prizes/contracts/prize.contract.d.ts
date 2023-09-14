import { BlockchainService } from 'src/blockchain/blockchain.service';
export declare class PrizeContract {
    private readonly blockchainService;
    private readonly contractABI;
    constructor(blockchainService: BlockchainService);
    getAdmins(contractAddress: string): Promise<any>;
    getFunders(contractAddress: string): Promise<any>;
}
