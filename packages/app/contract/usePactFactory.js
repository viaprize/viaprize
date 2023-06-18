import useWeb3Context from "@/context/hooks/useWeb3Context";
import PactFactoryAbi from "./abi/PactFactory.json";
import usePactContract from "./usePactContract";
import AbiCoder from "web3-eth-abi";
import config from "@/config";
import BN from "bignumber.js";
import Eth from "web3-eth";
import Web3 from "web3";

export default function usePactFactory() {
  const { web3, account, sendTx } = useWeb3Context();
  const { resolved, resolvable, balance, commitment } = usePactContract();

  const eth = new Eth(
    new Web3.providers.HttpProvider(config.provider, {
      reconnect: {
        auto: true,
      },
    })
  );

  return {
    async getAllPacts() {
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

      const pacts = [];

      for (const address of pactAddresses) {
        pacts.push({
          resolved: await resolved(address),
          resolvable: await resolvable(address),
          balance: await balance(address),
          commitment: await commitment(address),
          address: address,
        });
      }

      return pacts;
    },

    async createPact(commitment, endTime, sum, leads) {
      const duration = endTime - parseInt(new Date().valueOf() / 1000);

      console.log('end time', endTime, 'now', parseInt(new Date().valueOf() / 1000));

      const pactFactoryContract = new web3.eth.Contract(
        PactFactoryAbi,
        config.contracts.pactFactory
      );

      // TODO, this is fixed
      const amountInWei = new BN(sum).shiftedBy(18).toString();

      const func = pactFactoryContract.methods.create(
        await pactFactoryContract.methods.commit(commitment).call({
          from: account,
        }),
        new web3.utils.BN(duration),
        amountInWei,
        leads
      );
      return await sendTx(func);
    },
  };
}
