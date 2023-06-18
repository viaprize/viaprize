import useWeb3Context from "@/context/hooks/useWeb3Context";
import Erc20Abi from "./abi/ERC20.json";
import BN from "bignumber.js";

export default function useErc20Contract() {
  const { web3, account, sendTx } = useWeb3Context();

  return {
    async allowance(tokenAddress, spenderAddress) {
      const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);

      return await tokenContract.methods
        .allowance(account, spenderAddress)
        .call({ from: account });
    },

    async balanceOf(tokenAddress, decimals = 18) {
      const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
      const res = await tokenContract.methods
        .balanceOf(account)
        .call({ from: account });
      return new BN(res).shiftedBy(-decimals).toString();
    },

    async totalSupply(token) {
      const tokenContract = new web3.eth.Contract(Erc20Abi, token.address);
      return new Promise((resolve, reject) => {
        tokenContract.methods
          .totalSupply()
          .call()
          .then((res) => {
            resolve(new BN(res).shiftedBy(-token.decimals).toString());
          })
          .catch((err) => {
            console.log("Error", err);
            reject(err);
          });
      });
    },

    async transfer(tokenAddress, toAddress, amount) {
      const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
      const func = tokenContract.methods.transfer(
        toAddress,
        web3.utils.toWei(amount, "mwei")
      );
      return await sendTx(func);
    },

    async approve(tokenAddress, spenderAddress, amount = "10000000000000") {
      const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
      const func = tokenContract.methods.approve(
        spenderAddress,
        web3.utils.toWei(amount, "mwei")
      );
      return await sendTx(func);
    },
  };
}
