import useWeb3Context from "@/context/hooks/useWeb3Context";
import PactABI from "./abi/Pact.json";
import MulticallABI from "./abi/Multicall.json";
import config from "@/config";
import Eth from "web3-eth";
import Web3 from "web3";

export default function usePactContract() {
  const { web3, account, sendTx } = useWeb3Context();
  const eth = new Eth(
    new Web3.providers.HttpProvider(config.provider, {
      reconnect: {
        auto: true,
      },
    })
  );

  return {
    async resolved(pactAddress) {
      const pactContract = new eth.Contract(PactABI, pactAddress);

      return await pactContract.methods.resolved().call({ from: account });
    },

    async resolvable(pactAddress) {
      const pactContract = new eth.Contract(PactABI, pactAddress);
      return await pactContract.methods.resolvable().call({ from: account });
    },

    async balance(pactAddress) {
      const balance = await eth.getBalance(pactAddress);

      return web3.utils.fromWei(balance, "ether");
    },

    async commitment(pactAddress) {
      const pactContract = new eth.Contract(PactABI, pactAddress);
      return await pactContract.methods.commitment().call({ from: account });
    },
    
    // async sum(pactAddress) {
    //   const pactContract = new eth.Contract(PactABI, pactAddress);
    //   return await pactContract.methods.sum().call({ from: account });
    // },

    async safeAddress(pactAddress) {
      const pactContract = new eth.Contract(PactABI, pactAddress);
      return await pactContract.methods.safe().call({ from: account });
    },

    async resolve(pactAddress) {
      const contract = new web3.eth.Contract(PactABI, pactAddress);
      const func = contract.methods.resolve();
      return await sendTx(func);
    },

    async getPactInfo(pactAddress) {
      const web3 = new Web3(config.provider)
      const multicall = new web3.eth.Contract(
        MulticallABI,
        config.contracts.multicall3
      );

      const pactContract = new web3.eth.Contract(PactABI, pactAddress);
      // const sum = await this.sum(pactAddress)
      // console.log('sum', sum)
      const sum = await pactContract.methods.sum().call({ from: account });
      const leads = await pactContract.methods.leads().call({ from: account });

      const calls = [
        [pactAddress, pactContract.methods.safe().encodeABI()],
        [pactAddress, pactContract.methods.resolved().encodeABI()],
        [pactAddress, pactContract.methods.resolvable().encodeABI()],
        [pactAddress, pactContract.methods.end().encodeABI()]
      ];

      const res = await multicall.methods.aggregate(calls).call();

      return {
        balance: web3.utils.fromWei(await web3.eth.getBalance(pactAddress)),
        safe: web3.eth.abi.decodeParameter("address", res['returnData'][0]),
        resolved: web3.eth.abi.decodeParameter("bool", res['returnData'][1]),
        resolvable: web3.eth.abi.decodeParameter("bool", res['returnData'][2]),
        end: web3.eth.abi.decodeParameter("uint256", res['returnData'][3]),
        sum:sum,
        leads:leads
      }
    },
  };
}
