import { createConfig } from "@ponder/core";
import { PRIZE_FACTORY_ABI, PRIZE_V2_ABI } from "@viaprize/core/lib/abi";
import {
  CONTRACT_CONSTANTS_PER_CHAIN,
  type ValidChainIDs,
} from "@viaprize/core/lib/constants";
import { http, parseAbiItem } from "viem";

export default createConfig({
  networks: {
    main: {
      chainId: Number.parseInt(process.env.CHAIN_ID ?? "10"),
      transport: http(process.env.PONDER_RPC_URL),
    },
  },
  contracts: {
    PrizeV2Factory: {
      network: "main",
      abi: PRIZE_FACTORY_ABI,
      address:
        CONTRACT_CONSTANTS_PER_CHAIN[
          Number.parseInt(process.env.CHAIN_ID ?? "10") as ValidChainIDs
        ].PRIZE_FACTORY_V2_ADDRESS,
      startBlock: 125520838,
    },
    PrizeV2: {
      network: "main",
      abi: PRIZE_V2_ABI,
      factory: {
        address:
          CONTRACT_CONSTANTS_PER_CHAIN[
            Number.parseInt(process.env.CHAIN_ID ?? "10") as ValidChainIDs
          ].PRIZE_FACTORY_V2_ADDRESS,
        event: parseAbiItem(
          "event NewViaPrizeCreated(string indexed id, address indexed viaPrizeAddress)"
        ),
        parameter: "viaPrizeAddress",
      },
      startBlock: 125520838,
    },
  },
});
