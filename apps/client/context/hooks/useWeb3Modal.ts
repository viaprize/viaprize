import { useState, useEffect } from 'react';
import { infuraId } from '@/config';
import WalletConnect from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

interface ProviderOptions {
  walletconnect: {
    package: typeof WalletConnect;
    options: {
      infuraId: string;
    };
  };
}

export default function useWeb3Modal(): Web3Modal | undefined {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | undefined>();

  useEffect(() => {
    if (!web3Modal) {
      try {
        import('web3modal').then((Web3Modal) => {
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
            }),
          );
        });
      } catch (e) {
        console.log('Error while creating Web3Modal');
      }
    }
  }, []);

  return web3Modal;
}
