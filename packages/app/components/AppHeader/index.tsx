import React from "react";
import Link from "next/link";
import useWeb3Context from "@/context/hooks/useWeb3Context";
import { shortenAddress } from "@/context/tools";

export default function AppHeader() {
  const { account, connectWallet, resetWallet } = useWeb3Context();
  // temporary solution to skip ts check
  // const address = account || "";
  return (
    <header className="py-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="font-bold text-3xl cursor-pointer">PACT</a>
        </Link>
        {account ? (
          <div className="dropdown dropdown-end">
            <a className="btn px-3 mb-2" tabIndex={0}>
              {shortenAddress(account, 4)}
            </a>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={() => resetWallet()}>Disconnect</a>
              </li>
            </ul>
          </div>
        ) : (
          <a className="btn px-3" onClick={() => connectWallet()}>
            Connect Wallet
          </a>
        )}
      </div>
    </header>
  );
}
