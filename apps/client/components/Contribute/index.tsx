import React, { useState } from 'react';
import { toast } from 'react-toastify';

import useWeb3Context from '@/context/hooks/useWeb3Context';

export default function Contribute({ address, onContributed }: any) {
  const { web3, account, connectWallet }: any = useWeb3Context();
  const [amount, setAmount] = useState('');
  const doContribute = async () => {
    await web3.eth.sendTransaction({
      from: account,
      to: address,
      value: web3.utils.toWei(amount, 'ether'),
      data: '0x',
    });
    setAmount('');
    toast.success('Contributed!');
    onContributed();
  };
  return (
    <div className="flex gap-2 flex-wrap w-full">
      <input
        type="text"
        placeholder="Amount"
        className="input input-bordered flex-1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="btn" onClick={() => doContribute()}>
        Contribute
      </button>
    </div>
  );
}
