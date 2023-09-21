'use client';
/**
 * Web3ContextProvider component.
 * This component provides a React context with Web3-related utilities.
 *
 * @module components/Web3ContextProvider
 */
import React, { useState, createContext, useCallback, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import Web3 from 'web3';
import BN from 'bignumber.js';
import useWeb3Modal from './hooks/useWeb3Modal';
import { Loader } from '@mantine/core';
import config from '@/config';
/**
 * ProviderError is an interface for Ethereum provider errors.
 * It extends the built-in Error object with a `code` property.
 *
 * @interface ProviderError
 * @extends {Error}
 */
interface ProviderError extends Error {
  message: string;
  code: number;
}

/**
 * scanMapping is an object mapping chain IDs to BlockExporer URLs.
 *
 * @constant
 * @type {Object}
 */

const scanMapping: { [key: number]: string } = {
  56: 'https://bscscan.com',
};

/**
 * actionMapping is an array of status messages for transaction actions.
 *
 * @constant
 * @type {Array}
 */

const actionMapping = [
  'Transaction being processed',
  'Transaction Success',
  'Transaction Failed',
];
/**
 * Web3ContextType is an interface for the Web3 context.
 * It includes the Web3 instance, the current chain ID, account, and block number,
 * as well as methods for interacting with the Ethereum blockchain.
 *
 * @interface Web3ContextType
 */
export interface Web3ContextType {
  web3?: Web3;
  chainId?: number;
  account?: string;
  networkId?: number;
  blockNumber?: number;
  connectWallet: () => Promise<void>;
  connectSoul: () => Promise<void>;
  getEthBalance: () => Promise<string>;
  resetWallet: () => Promise<void>;
  estimateGas: (func: any, value?: number) => Promise<number | undefined>;
  sendTx: (func: any, value?: number) => Promise<any>;
  signMessage: (val: string) => Promise<string>;
}

/**
 * Web3Context is a React context for Web3.
 * It provides a Web3 instance, the current chain ID, account, and block number,
 * as well as methods for interacting with the Ethereum blockchain.
 *
 * @constant
 * @type {React.Context}
 */
export const Web3Context = createContext<Web3ContextType>({
  web3: undefined,
  chainId: undefined,
  networkId: undefined,
  blockNumber: undefined,
  account: undefined,
  connectWallet: async () => {},
  connectSoul: async () => {},
  getEthBalance: async () => {
    return '';
  },
  resetWallet: async () => {},
  estimateGas: async () => {
    return 0;
  },
  sendTx: async () => {},
  signMessage: async (val) => {
    return '';
  },
});

/**
 * Web3ContextProviderProp is an interface for the props of the Web3ContextProvider component.
 *
 * @interface Web3ContextProviderProp
 */

type Web3ContextProviderProp = {
  children: ReactNode;
};

/**
 * Web3ContextProvider is a React component that provides a Web3 context to its children.
 * It uses the useWeb3Modal hook to connect to an Ethereum provider and provides methods for interacting with the Ethereum blockchain.
 *
 * @component
 * @param {Web3ContextProviderProp} props
 */
export const Web3ContextProvider = ({
  // chainId,
  // endpoint,
  children,
}: Web3ContextProviderProp) => {
  const web3Modal = useWeb3Modal();
  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState<number>(0);
  const [networkId, setnetworkId] = useState(0);
  const [blockNumber, setBlockNumber] = useState(0);
  const listenProvider = () => {
    window.ethereum.on('connect', (data) => {
      console.log('event connect', data);
    });
    window.ethereum.on('disconnect', (data) => {
      console.log('event disconnect', data);
    });
    window.ethereum.on('close', (data) => {
      console.log('close', data);
      resetWallet();
    });
    window.ethereum.on('accountsChanged', async (accounts) => {
      console.log('account changed', accounts);
      setAccount(accounts[0]);
    });
    window.ethereum.on('chainChanged', (chainId) => {
      setChainId(parseInt(chainId, 16));
    });
  };

  const connectWallet = useCallback(async () => {
    if (!web3Modal) {
      throw new Error('Web3 Modal is Undefined');
    }
    try {
      const provider = await web3Modal.connect();

      const web3Raw = new Web3(provider);

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      setWeb3(web3Raw);
      // get account, use this variable to detech if user is connected
      // const accounts = await web3Raw.eth.getAccounts();
      console.log('after get accounts', accounts[0]);
      setAccount(accounts[0]);

      // get network id
      setnetworkId(await web3Raw.eth.net.getId());

      const foo = await web3Raw.eth.getChainId();

      if (foo != config.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(config.chainId) }],
          });
          console.log(`switched to chainid : ${chainId} succesfully`);
        } catch (err: any) {
          console.log(
            `error occured while switching chain to chainId ${chainId}, err: ${err.message} code: ${err.code}`,
          );

          if (err.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: Web3.utils.toHex(config.chainId),
                    chainName: config.chainName,
                    nativeCurrency: {
                      name: 'ETHER',
                      symbol: 'ETH', // 2-6 characters long
                      decimals: 18,
                    },
                    rpcUrls: [config.provider],
                    blockExplorerUrls: [config.scanUrl],
                  },
                ],
              });
            } catch (err: any) {
              console.log(
                `error ocuured while adding new chain with chainId:${chainId}, err: ${err.message}`,
              );
            }
          }
        }
      }
      // get chain id
      setChainId(foo);

      // init block number
      setBlockNumber(await web3Raw.eth.getBlockNumber());

      console.log('blocknumber', await web3Raw.eth.getBlockNumber());

      if (window.ethereum) {
        listenProvider();
      }
    } catch (error) {
      // setWeb3(new Web3(endpoint));
      console.log(error);
    }
  }, [web3Modal]);

  const getEthBalance = async () => {
    if (!web3) throw new Error('Web3 is undefined');
    const res = await web3.eth.getBalance(account);
    return new BN(res).shiftedBy(-18).toString();
  };

  const resetWallet = useCallback(async () => {
    if (!web3Modal) {
      throw new Error('Web3 Modal is Undefined');
    }
    if (web3 && web3.currentProvider && web3.currentProvider) {
      // Reset the wallet
      await web3.eth.accounts.wallet.clear();
    }
    setAccount('');
    await web3Modal.clearCachedProvider();
  }, [web3Modal]);

  const estimateGas = async (func: any, value = 0) => {
    console.log(value, 'this is the value');
    try {
      const gas = await func.estimateGas({
        from: account,
        value,
      });
      return Math.floor(gas * 1.2);
    } catch (error: any) {
      console.log('errr', error);
      const objStartIndex = error.message.indexOf('{');
      toast.error(error.message.slice(0, objStartIndex));
    }
  };

  const signMessage = async (message: string) => {
    if (!web3) {
      throw new Error('No Web3 Found');
    }
    return await web3.eth.personal.sign(message, account, '');
  };

  const goScan = (txnHash: string) => {
    const chainIdMapping = scanMapping[chainId];
    window.open(`${chainIdMapping}/tx/${txnHash}`);
  };

  /**
   *
   * @param {*} func , required this is the contract method function
   * @param {*} actionType , required
   * @param {*} value , default 0
   * @returns
   */

  const sendTx = async (func: any, value = 0) => {
    const gasLimit = await estimateGas(func, value);
    if (!gasLimit) throw new Error('Gas Limit is undefined');
    if (!isNaN(gasLimit)) {
      return func
        .send({
          gas: gasLimit,
          from: account,
          value,
        })
        .on('transactionHash', (txnHash: string) => {
          toast.info(actionMapping[0], {
            toastId: txnHash,
            icon: <Loader color="cyan" />,
            autoClose: false,
            onClick: () => goScan(txnHash),
          });
        })
        .on('receipt', async (receipt: { transactionHash: any }) => {
          console.log('receipt is', receipt);
          const txnHash = receipt?.transactionHash;
          toast.dismiss(txnHash);
          toast.success(actionMapping[1], {
            // toastId: txnHash,
            onClick: () => goScan(txnHash),
          });
        })
        .on('error', async (err: { code: number }, txn: { transactionHash: any }) => {
          const txnHash = txn?.transactionHash;
          await toast.dismiss(txnHash);

          if (err.code === 4001) {
            toast.error('User canceled action');
          } else {
            toast.error(actionMapping[2], {
              onClick: () => goScan(txnHash),
            });
          }
        });
    }
  };

  useEffect(() => {
    // trigger auto connect
    if (!web3Modal) {
      return;
    }
    connectWallet();
  }, [web3Modal]);

  return (
    <Web3Context.Provider
      value={{
        web3,
        chainId,
        networkId,
        account,
        blockNumber,
        connectWallet,
        getEthBalance,
        resetWallet,
        estimateGas,
        sendTx,
        signMessage,
        connectSoul: connectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

/**
 * Web3ContextConsumer is a React context consumer for the Web3 context.
 *
 * @constant
 * @type {React.Context.Consumer}
 */

export const Web3ContextConsumer = Web3Context.Consumer;
