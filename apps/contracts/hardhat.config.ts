import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC,
      accounts: [process.env.MUMBAI_PRIVATEKEY as string],
    },
  },
};

export default config;
