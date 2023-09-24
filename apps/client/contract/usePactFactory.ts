// @ts-nocheck
import useWeb3Context from "@/context/hooks/useWeb3Context";
import PactFactoryAbi from "./abi/PactFactory.json";
import usePactContract from "./usePactContract";
import AbiCoder from "web3-eth-abi";
import config from "@/config";
import BN from "bignumber.js";
import Eth from "web3-eth";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

/**
 * Interface for the pact object.
 */
interface Pact {
  resolved: boolean;
  resolvable: boolean;
  balance: string;
  commitment: any;
  address: string;
}

/**
 * Interface for the PactFactory hook.
 */
interface PactFactory {
  getAllPacts(): Promise<Pact[]>;
  createPact(
    commitment: any,
    endTime: number,
    sum: any,
    leads: any
  ): Promise<any>;
}

/**
 * Custom hook for interacting with the PactFactory contract.
 */

export default function usePactFactory(): PactFactory {
  const { web3, account, sendTx } = useWeb3Context();
  const { resolved, resolvable, balance, commitment } = usePactContract();

  const eth = new Eth(new Web3.providers.HttpProvider(config.provider));
  if (!web3) {
    return {} as PactFactory;
  }

  return {
    /**
     * Gets all pacts created by the PactFactory contract.
     * @returns An array of pact objects.
     */
    async getAllPacts(): Promise<Pact[]> {
      const logs = await eth.getPastLogs({
        fromBlock: 8106597,
        address: "0x642a7864cBe44ED24D408Cbc38117Cfd6E6D1a95",
        topics: [
          "0xe3758539c1bd6726422843471b2886c2d2cefd3b4aead6778386283e20a32a80",
        ],
      });

      if (!logs || !logs.length) {
        return [];
      }

      const pactAddresses = logs.map((eventLog) => {
        return AbiCoder.decodeParameter("address", eventLog.data);
      });

      const pacts: Pact[] = [];

      for (const address of pactAddresses) {
        pacts.push({
          resolved: await resolved(address as unknown as string),
          resolvable: await resolvable(address as unknown as string),
          balance: await balance(address as unknown as string),
          commitment: await commitment(address as unknown as string),
          address: address as unknown as string,
        });
      }

      return pacts;
    },

    /**
     * Creates a new pact.
     * @param commitment The commitment value for the pact.
     * @param endTime The end time for the pact.
     * @param sum The sum value for the pact.
     * @param leads The leads value for the pact.
     * @returns A promise that resolves to the transaction receipt.
     */
    async createPact(
      commitment: any,
      endTime: number,
      sum: number,
      leads: any
    ): Promise<any> {
      const duration = endTime - Math.floor(new Date().valueOf() / 1000);

      console.log(
        "end time",
        endTime,
        "now",
        Math.floor(new Date().valueOf() / 1000)
      );
      const amountInWei = new BN(sum).shiftedBy(18).toString();

      const pactFactoryContract = new web3.eth.Contract(
        PactFactoryAbi as AbiItem[],
        config.contracts.pactFactory
      );
      console.log(pactFactoryContract, "pactFactoryContract");

      const estimatedGas = await pactFactoryContract.methods
        .create(
          await pactFactoryContract.methods.commit(commitment).call({
            from: account,
          }),
          new BN(duration),
          amountInWei,
          leads
        )
        .estimateGas({ from: account });
      console.log(estimatedGas, "estimatedGas");

      const func = pactFactoryContract.methods.create(
        await pactFactoryContract.methods.commit(commitment).call({
          from: account,
        }),
        new BN(duration),
        amountInWei,
        leads
      );

      return await sendTx(func);
    },
  };
}
