// @ts-nocheck
/**
 * useERC721Contract hook.
 * This hook provides utilities for interacting with ERC721 tokens.
 *
 * @module hooks/useERC721Contract
 */

import { AbiItem } from "web3-utils";
import axios from "axios";
import useWeb3Context from "@/context/hooks/useWeb3Context";
import Erc721Abi from "./abi/ERC721.json";

/**
 * @function formatIPFS
 * @description Formats an IPFS URL to be compatible with HTTP.
 * @param {string} val - The IPFS URL.
 * @returns {string} The formatted URL.
 */
const formatIPFS = (val: string): string => {
  if (!val) {
    return val;
  }
  if (val.indexOf("ipfs://") > -1) {
    return val.replace("ipfs://", "https://ipfs.io/ipfs/");
  } else {
    return val;
  }
};

/**
 * @function useERC721Contract
 * @description Provides utilities for interacting with ERC721 tokens.
 * @returns {Object} An object with methods for interacting with ERC721 tokens.
 */
export default function useERC721Contract() {
  const { account, sendTx, web3 } = useWeb3Context();
  if (!web3) {
    return;
  }

  return {
    /**
     * @method isApprovedForAll
     * @description Checks if a spender is approved for all tokens of the current account.
     * @param {string} nftAddress - The address of the NFT contract.
     * @param {string} spender - The address of the spender.
     * @returns {Promise<boolean>} Whether the spender is approved for all tokens.
     */
    async isApprovedForAll(
      nftAddress: string,
      spender: string
    ): Promise<boolean> {
      const contract = new web3.eth.Contract(
        Erc721Abi as AbiItem[],
        nftAddress
      );

      return await contract.methods.isApprovedForAll(account, spender).call();
    },

    /**
     * @method transferFrom
     * @description Transfers an ERC721 token from the current account to another address.
     * @param {string} nftAddress - The address of the NFT contract.
     * @param {string} toAddress - The address to transfer the token to.
     * @param {string} tokenId - The ID of the token to transfer.
     */
    async transferFrom(
      nftAddress: string,
      toAddress: string,
      tokenId: string
    ): Promise<void> {
      const contract = new web3.eth.Contract(
        Erc721Abi as AbiItem[],
        nftAddress
      );
      const func = contract.methods.transferFrom(account, toAddress, tokenId);
      sendTx(func);
    },

    /**
     * @method setApprovalForAll
     * @description Approves or revokes approval for a spender to manage all tokens of the current account.
     * @param {string} nftAddress - The address of the NFT contract.
     * @param {string} spender - The address of the spender.
     * @returns {Promise<void>}
     */
    async setApprovalForAll(
      nftAddress: string,
      spender: string
    ): Promise<void> {
      const contract = new web3.eth.Contract(
        Erc721Abi as AbiItem[],
        nftAddress
      );
      const func = contract.methods.setApprovalForAll(spender, true);
      return await sendTx(func);
    },

    /**
     * @method tokenURI
     * @description Gets the URI of a specific token.
     * @param {string} nftAddress - The address of the NFT contract.
     * @param {string} id - The ID of the token.
     * @returns {Promise<string>} The URI of the token.
     */
    async tokenURI(nftAddress: string, id: string): Promise<string> {
      const contract = new web3.eth.Contract(
        Erc721Abi as AbiItem[],
        nftAddress
      );
      return await contract.methods.tokenURI(id).call();
    },

    /**
     * @method balanceOf
     * @description Gets the balance of the current account in a specific ERC721 contract.
     * @param {string} nftAddress - The address of the NFT contract.
     * @returns {Promise<string>} The balance of the current account.
     */
    async balanceOf(nftAddress: string): Promise<string> {
      const contract = new web3.eth.Contract(
        Erc721Abi as AbiItem[],
        nftAddress
      );
      const balance = await contract.methods.balanceOf(account).call();
      return balance;
    },

    /**
     * @method getNftInfo
     * @description Gets information about a specific NFT.
     * @param {string} nftAddress - The address of the NFT contract.
     * @param {string} tokenId - The ID of the token.
     * @returns {Promise<Object>} Information about the NFT.
     */
    async getNftInfo(nftAddress: string, tokenId: string): Promise<Object> {
      const contract = new web3.eth.Contract(
        Erc721Abi as AbiItem[],
        nftAddress
      );
      const uri = await contract.methods.tokenURI(tokenId).call();
      const formattedUri = formatIPFS(uri);

      const response = await axios.get(formattedUri);
      return response.data;
    },
    /**
     * @method getName
     * @description Gets the name of the ERC721 contract.
     * @param {string} nftAddress - The address of the NFT contract.
     * @returns {Promise<string>} The name of the contract.
     */
    async getName(nftAddress: string): Promise<string> {
      const contract = new web3.eth.Contract(
        Erc721Abi as AbiItem[],
        nftAddress
      );
      return await contract.methods.name().call();
    },

    /**
     * @method mint
     * @description Mints a new ERC721 token.
     * @param {string} nftAddress - The address of the NFT contract.
     * @param {string} to - The address to mint the token to.
     * @param {string} tokenId - The ID of the token.
     * @returns {Promise<void>}
     */
    async mint(nftAddress: string, to: string, tokenId: string): Promise<void> {
      const contract = new web3.eth.Contract(
        Erc721Abi as AbiItem[],
        nftAddress
      );
      const func = contract.methods.mint(to, tokenId);
      return await sendTx(func);
    },
  };
}
