import { createConfig } from "@ponder/core";
import { PRIZE_FACTORY_ABI, PRIZE_V2_ABI } from "@viaprize/core/lib/abi";
import {
  CONTRACT_CONSTANTS_PER_CHAIN,
  type ValidChainIDs,
} from "@viaprize/core/lib/constants";
import { http, parseAbiItem } from "viem";
import { env } from "./src/env";

export default createConfig({
  networks: {
    main: {
      chainId: Number.parseInt(env.CHAIN_ID ?? "10"),
      transport: http(env.PONDER_RPC_URL),
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
      startBlock: Number.parseInt(env.INDEXER_PRIZE_FACTORY_STARTBLOCK),
    },
    PrizeV2: {
      network: "main",
      abi: PRIZE_V2_ABI,
      factory: {
        address:
          CONTRACT_CONSTANTS_PER_CHAIN[
            Number.parseInt(env.CHAIN_ID ?? "10") as ValidChainIDs
          ].PRIZE_FACTORY_V2_ADDRESS,
        event: parseAbiItem(
          "event NewViaPrizeCreated(string id, address viaPrizeAddress)"
        ),
        parameter: "viaPrizeAddress",
      },
      startBlock: Number.parseInt(env.INDEXER_PRIZE_STARTBLOCK),
    },
  },
});
