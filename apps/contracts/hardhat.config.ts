import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: {

    version: "0.8.20",
    settings: {
      evmVersion: "paris",
    }

  },
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC,
      accounts: [process.env.MUMBAI_PRIVATEKEY as string],
    }
    // op: {
    //   url: process.env.OP_RPC,
    //   accounts: [process.env.OP_PRIVATEKEY as string],

    // },
  }
};

export default config;
