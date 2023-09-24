import useWeb3Context from "@/context/hooks/useWeb3Context";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Contribute({ address, onContributed }) {
  const { web3, account } = useWeb3Context();
  const [amount, setAmount] = useState("");
  const doContribute = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment  -- because any needs to be implemented
    await web3?.eth.sendTransaction({
      from: account,
      /* eslint-disable @typescript-eslint/no-unsafe-assignment -- needed this for the function */
      to: address as string,
      value: web3.utils.toWei(amount, "ether"),
      data: "0x",
    });
    setAmount("");
    toast.success("Contributed!");
    onContributed();
  };
  return (
    <div className="flex gap-2 flex-wrap w-full">
      <input
        className="input input-bordered flex-1"
        onChange={(e) => {
          setAmount(e.target.value);
        }}
        placeholder="Amount"
        type="text"
        value={amount}
      />
      <button className="btn" onClick={() => doContribute()}>
        Contribute
      </button>
    </div>
  );
}
