// @ts-nocheck
/**
 * @module hooks/usePactContract
 * @description Provides utilities for interacting with a Pact contract.
 */

import useWeb3Context from "@/context/hooks/useWeb3Context";
import PactABI from "./abi/Pact.json";
import MulticallABI from "./abi/Multicall.json";
import config from "@/config";
import Eth from "web3-eth";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
interface PactContractInfo {
  balance: string;
  safe: string;
  resolved: boolean;
  resolvable: boolean;
  end: number;
  sum: any;
  leads: any;
}

interface PactContract {
  resolved(pactAddress: string): Promise<boolean>;
  resolvable(pactAddress: string): Promise<boolean>;
  balance(pactAddress: string): Promise<string>;
  commitment(pactAddress: string): Promise<any>;
  safeAddress(pactAddress: string): Promise<string>;
  resolve(pactAddress: string): Promise<void>;
  getPactInfo(pactAddress: string): Promise<PactContractInfo>;
}

/**
 * @function usePactContract
 * @description Provides utilities for interacting with a Pact contract.
 * @returns {Object} An object with methods for interacting with a Pact contract.
 */
export default function usePactContract(): PactContract {
  const { web3, account, sendTx } = useWeb3Context();
  const eth = new Eth(new Web3.providers.HttpProvider(config.provider));
  // if (!web3) {
  //   throw new Error('Web3 not found');
  // }
  if (!web3) {
    return {} as PactContract;
  }
  return {
    /**
     * @method resolved
     * @description Checks if a Pact contract is resolved.
     * @param {string} pactAddress - The address of the Pact contract.
     * @returns {Promise<boolean>} Whether the Pact contract is resolved.
     */
    async resolved(pactAddress: string): Promise<boolean> {
      const pactContract = new eth.Contract(PactABI as AbiItem[], pactAddress);
      return await pactContract.methods.resolved().call({ from: account });
    },

    /**
     * @method resolvable
     * @description Checks if a Pact contract is resolvable.
     * @param {string} pactAddress - The address of the Pact contract.
     * @returns {Promise<boolean>} Whether the Pact contract is resolvable.
     */
    async resolvable(pactAddress: string): Promise<boolean> {
      const pactContract = new eth.Contract(PactABI as AbiItem[], pactAddress);
      return await pactContract.methods.resolvable().call({ from: account });
    },

    /**
     * @method balance
     * @description Gets the balance of a Pact contract.
     * @param {string} pactAddress - The address of the Pact contract.
     * @returns {Promise<string>} The balance of the Pact contract in Ether.
     */
    async balance(pactAddress: string): Promise<string> {
      const balance = await eth.getBalance(pactAddress);
      return web3.utils.fromWei(balance, "ether");
    },

    /**
     * @method commitment
     * @description Gets the commitment value of a Pact contract.
     * @param {string} pactAddress - The address of the Pact contract.
     * @returns {Promise<any>} The commitment value of the Pact contract.
     */
    async commitment(pactAddress: string): Promise<any> {
      const pactContract = new eth.Contract(PactABI as AbiItem[], pactAddress);
      return await pactContract.methods.commitment().call({ from: account });
    },

    /**
     * @method safeAddress
     * @description Gets the safe address associated with a Pact contract.
     * @param {string} pactAddress - The address of the Pact contract.
     * @returns {Promise<string>} The safe address associated with the Pact contract.
     */
    async safeAddress(pactAddress: string): Promise<string> {
      const pactContract = new eth.Contract(PactABI as AbiItem[], pactAddress);
      return await pactContract.methods.safe().call({ from: account });
    },

    /**
     * @method resolve
     * @description Resolves a Pact contract.
     * @param {string} pactAddress - The address of the Pact contract.
     * @returns {Promise<void>}
     */
    async resolve(pactAddress: string): Promise<void> {
      const contract = new web3.eth.Contract(PactABI as AbiItem[], pactAddress);
      const func = contract.methods.resolve();
      return await sendTx(func);
    },

    /**
     * @method getPactInfo
     * @description Gets information about a Pact contract which is shown in history Item.
     * @param {string} pactAddress - The address of the Pact contract.
     * @returns {Promise<PactContractInfo>} Information about the Pact contract.
     */
    async getPactInfo(pactAddress: string): Promise<PactContractInfo> {
      const web3 = new Web3(config.provider);
      const multicall = new web3.eth.Contract(
        MulticallABI as AbiItem[],
        config.contracts.multicall3,
      );

      const pactContract = new web3.eth.Contract(
        PactABI as AbiItem[],
        pactAddress,
      );
      const sum = await pactContract.methods.sum().call({ from: account });
      const leads = await pactContract.methods.leads().call({ from: account });

      const calls = [
        [pactAddress, pactContract.methods.safe().encodeABI()],
        [pactAddress, pactContract.methods.resolved().encodeABI()],
        [pactAddress, pactContract.methods.resolvable().encodeABI()],
        [pactAddress, pactContract.methods.end().encodeABI()],
      ];

      const res = await multicall.methods.aggregate(calls).call();

      return {
        balance: web3.utils.fromWei(await web3.eth.getBalance(pactAddress)),
        safe: web3.eth.abi.decodeParameter("address", res["returnData"][0]),
        resolved: web3.eth.abi.decodeParameter("bool", res["returnData"][1]),
        resolvable: web3.eth.abi.decodeParameter("bool", res["returnData"][2]),
        end: web3.eth.abi.decodeParameter("uint256", res["returnData"][3]),
        sum: sum,
        leads: leads,
      } as unknown as PactContractInfo;
    },
  };
}
