export declare class BlockchainService {
    private provider;
    constructor();
    getBalance(address: string): Promise<bigint>;
    callContractFunction(contractAddress: string, contractABI: any[], functionName: string, ...args: any[]): Promise<any>;
}
