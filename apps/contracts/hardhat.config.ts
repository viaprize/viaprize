// import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-viem";
import "@nomiclabs/hardhat-ethers";
// import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

// import "tsconfig-paths/register";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },

      viaIR: true,

    }

  },
  networks: {
    // mumbai: {
    //   url: process.env.MUMBAI_RPC,
    //   accounts: [process.env.MUMBAI_PRIVATEKEY],
    // },
    op: {
      url: process.env.OP_RPC,
      accounts: [process.env.OP_PRIVATEKEY as string],

    },
  },
};

export default config;
