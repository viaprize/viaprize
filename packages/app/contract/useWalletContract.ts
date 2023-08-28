import useWeb3Context from "@/context/hooks/useWeb3Context";
import WalletAbi from "./abi/Wallet.json";
import { AbiItem } from "web3-utils";

export default function useWaletContract() {
  const { web3, account } = useWeb3Context();
  if (!web3) {
    return;
  }

  return {
    async isValidSignature(hash: string, signature: string) {
      const contract = new web3.eth.Contract(WalletAbi as AbiItem[], account);

      return await contract.methods
        .isValidSignature(hash, signature)
        .call({ from: account });
    },
  };
}
