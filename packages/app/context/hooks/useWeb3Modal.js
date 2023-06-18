import { useState, useEffect } from "react";
import { infuraId } from "@/config";
import WalletConnect from "@walletconnect/web3-provider";

export default function useWeb3Modal() {
  const [web3Modal, setWeb3Modal] = useState(null);

  useEffect(() => {
    if (!web3Modal) {
      try {
        import("web3modal").then((Web3Modal) => {
          setWeb3Modal(
            new Web3Modal.default({
              cacheProvider: true,
              providerOptions: {
                walletconnect: {
                  package: WalletConnect,
                  options: {
                    infuraId,
                  },
                },
              },
            })
          );
        });
      } catch (e) {
        console.log("Error while creating Web3Modal");
      }
    }
  }, []);

  return web3Modal;
}
