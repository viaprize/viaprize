/**
 * useErc20Contract hook.
 * This hook provides utilities for interacting with ERC20 tokens.
 *
 * @module hooks/useErc20Contract
 */

import useWeb3Context from "@/context/hooks/useWeb3Context";
import Erc20Abi from "./abi/ERC20.json";
import BN from "bignumber.js";
import { AbiItem } from "web3-utils";

/**
 * @function useErc20Contract
 * @description Provides utilities for interacting with ERC20 tokens.
 * @returns {Object} An object with methods for interacting with ERC20 tokens.
 */
export default function useErc20Contract() {
  const { web3, account, sendTx } = useWeb3Context();
  if (!web3) {
    throw new Error("Web3 not found");
  }

  return {
    /**
     * @method allowance
     * @description Checks the allowance of a spender for a particular token.
     * @param {string} tokenAddress - The address of the token contract.
     * @param {string} spenderAddress - The address of the spender.
     * @returns {Promise<number>} The allowance of the spender.
     */
    async allowance(
      tokenAddress: string,
      spenderAddress: string
    ): Promise<number> {
      const tokenContract = new web3.eth.Contract(
        Erc20Abi as AbiItem[],
        tokenAddress
      );

      return await tokenContract.methods
        .allowance(account, spenderAddress)
        .call({ from: account });
    },

    /**
     * @method balanceOf
     * @description Checks the balance of the current account for a particular token.
     * @param {string} tokenAddress - The address of the token contract.
     * @param {number} decimals - The number of decimals the token has.
     * @returns {Promise<string>} The balance of the current account.
     */
    async balanceOf(tokenAddress: string, decimals = 18): Promise<string> {
      const tokenContract = new web3.eth.Contract(
        Erc20Abi as AbiItem[],
        tokenAddress
      );
      const res = await tokenContract.methods
        .balanceOf(account)
        .call({ from: account });
      return new BN(res).shiftedBy(-decimals).toString();
    },

    /**
     * @method totalSupply
     * @description Checks the total supply of a token.
     * @param {Object} token - The token to check.
     * @param {string} token.address - The address of the token contract.
     * @param {number} token.decimals - The number of decimals the token has.
     * @returns {Promise<string>} The total supply of the token.
     */
    async totalSupply(token: {
      address: string;
      decimals: number;
    }): Promise<string> {
      const tokenContract = new web3.eth.Contract(
        Erc20Abi as AbiItem[],
        token.address
      );
      return new Promise((resolve, reject) => {
        tokenContract.methods
          .totalSupply()
          .call()
          .then((res: any) => {
            resolve(new BN(res).shiftedBy(-token.decimals).toString());
          })
          .catch((err: any) => {
            console.log("Error", err);
            reject(err);
          });
      });
    },

    /**
     * @method transfer
     * @description Transfers a token to a recipient.
     * @param {string} tokenAddress - The address of the token contract.
     * @param {string} toAddress - The address of the recipient.
     * @param {string} amount - The amount of token to send.
     * @returns {Promise<any>} The transaction receipt.
     */
    async transfer(
      tokenAddress: string,
      toAddress: string,
      amount: string
    ): Promise<any> {
      const tokenContract = new web3.eth.Contract(
        Erc20Abi as AbiItem[],
        tokenAddress
      );
      const func = tokenContract.methods.transfer(
        toAddress,
        web3.utils.toWei(amount, "mwei")
      );
      return await sendTx(func);
    },

    /**
     * @method approve
     * @description Approves a spender to spend a certain amount of token.
     * @param {string} tokenAddress - The address of the token contract.
     * @param {string} spenderAddress - The address of the spender.
     * @param {string} amount - The amount of token to approve.
     * @returns {Promise<any>} The transaction receipt.
     */
    async approve(
      tokenAddress: string,
      spenderAddress: string,
      amount = "10000000000000"
    ): Promise<any> {
      const tokenContract = new web3.eth.Contract(
        Erc20Abi as AbiItem[],
        tokenAddress
      );
      const func = tokenContract.methods.approve(
        spenderAddress,
        web3.utils.toWei(amount, "mwei")
      );
      return await sendTx(func);
    },
  };
}
