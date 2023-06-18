import useWeb3Context from "@/context/hooks/useWeb3Context";
import WalletAbi from "./abi/Wallet.json";

export default function useWaletContract() {
  const { web3, account} = useWeb3Context();

  return {
    async isValidSignature(hash, signature) {
      const contract = new web3.eth.Contract(WalletAbi, account);

      return await contract.methods
        .isValidSignature(hash, signature)
        .call({ from: account });
    },
  };
}
