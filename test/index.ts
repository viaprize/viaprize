console.log("Hello via Bun!");

// 1. Import modules.
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { optimism } from 'viem/chains';
import { USDC_E_BRIDGE } from './abi';

const account = privateKeyToAccount('0x5b55a2cfac7db16d3b5c530a85965d5d41527159c521a5fdf1695ad503e91f75')
// 2. Set up your client with desired chain & transport.
const client = createWalletClient({
    chain: optimism,
    account,
    transport: http("https://opt-mainnet.g.alchemy.com/v2/0oSF4_qVky3ZRi2gFvitxFB91JRRw-fm"),
})

const publicClient = createPublicClient({
    chain: optimism,
    transport: http("https://opt-mainnet.g.alchemy.com/v2/0oSF4_qVky3ZRi2gFvitxFB91JRRw-fm")
})
const usdceData = {
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    abi: USDC_E_BRIDGE,
}
const tokenName = await publicClient.readContract({
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    abi: USDC_E_BRIDGE,
    functionName: "name"
})




const tokenNonces = 10;


client.signTypedData({
    "types": {
        "EIP712Domain": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "version",
                "type": "string"
            },
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ],
        "Permit": [
            {
                "name": "owner",
                "type": "address"
            },
            {
                "name": "spender",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "nonce",
                "type": "uint256"
            },
            {
                "name": "deadline",
                "type": "uint256"
            }
        ],
    },
    "primaryType": "Permit",
    "domain": {
        "name": tokenName as string,
        "version": "2",
        "chainId": parseInt(publicClient.chain.id.toString()),
        "verifyingContract": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"
    },
    "message": {
        "owner": client.account.address,
        "spender": "0x0050be05276285D4c06B43c8b9aee0deab2ee90F",
        "value": 20000,
        "nonce": tokenNonces as number,
        "deadline": parseInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16)
    }
}
)



