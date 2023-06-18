import { useMemo } from "react";
import useWeb3Context from "./useWeb3Context";

export default function useContract(ABI, address) {
  const { web3 } = useWeb3Context();
  return useMemo(() => {
    if (!web3) {
      return;
    }
    return new web3.eth.Contract(ABI, address);
  }, [web3]);
}
