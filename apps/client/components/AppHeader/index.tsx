import useWeb3Context from "@/context/hooks/useWeb3Context";
import { shortenAddress } from "@/context/tools";
import Link from "next/link";

export default function AppHeader() {
  const { account, connectWallet, resetWallet } = useWeb3Context();
  return (
    <header className="py-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-3xl cursor-pointer">
          PACT:
        </Link>
        {account ? (
          <div className="dropdown dropdown-end">
            <a
              className="btn px-3 mb-2"
              href="#address"
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- because this said so
              tabIndex={0}
            >
              {shortenAddress(account, 4)}
            </a>
            <ul
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- because this is used for tab ui
              tabIndex={0}
              role="presentation"
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button
                  className="btn"
                  onClick={() =>
                    resetWallet().then(console.log).catch(console.error)
                  }
                >
                  Disconnect
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className="btn px-3"
            onClick={() =>
              connectWallet().then(console.log).catch(console.error)
            }
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
