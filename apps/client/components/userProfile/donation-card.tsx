'use client';

import { backendApi } from '@/lib/backend';
import { USDC } from '@/lib/constants';
import { usdcSignType } from '@/lib/utils';
import { chain } from '@/lib/wagmi';
import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Flex,
  Group,
  Input,
  Modal,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { erc20ABI, readContract } from '@wagmi/core';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { hashTypedData, hexToSignature, isAddress } from 'viem';
import { useContractRead, useWalletClient } from 'wagmi';
import { TransactionToast } from '../custom/transaction-toast';
import useAppUser from '../hooks/useAppUser';

interface MoonpayFormValues {
  email: string;
  number: number;
  amount: number;
}

interface ConversionRates {
  ethToUsd: number;
  usdToEth: number;
}

export default function SendCard() {
  const { data: walletClient } = useWalletClient();
  const getUsdcSignatureData = async (value: number) => {
    const walletAddress = walletClient?.account.address;
    if (!walletAddress) {
      throw new Error('Please login to donate');
    }
    const amount = BigInt(value);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 100_000);
    const nonce = await readContract({
      abi: [
        {
          constant: true,
          inputs: [
            {
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'nonces',
          outputs: [
            {
              name: '',
              type: 'uint256',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ] as const,
      address: USDC,
      functionName: 'nonces',
      args: [walletAddress],
    });

    const signData = {
      owner: walletClient?.account.address,
      spender: '0xAce4C1d8Ed5E592A30F07Bfe08e6F8CedCE18959',
      value: amount,
      nonce: BigInt(nonce),
      deadline: deadline,
    };

    return signData;
  };
  const form = useForm<MoonpayFormValues>({
    initialValues: {
      email: '',
      number: 0,
      amount: 0,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  const { appUser } = useAppUser();
  const [recieverAddress, setRecieverAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const { wallet } = usePrivyWagmi();
  const { user, exportWallet } = usePrivy();

  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedChangeNow, { open: openChangeNow, close: closeChangeNow }] =
    useDisclosure(false);
  const { data: balance, refetch } = useContractRead({
    address: USDC as `0x${string}`,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [(wallet?.address ?? '') as `0x${string}`],
  });

  useEffect(() => {
    if (!balance) {
      void refetch();
    }
  }, [balance]);

  const handleSend = useCallback(async () => {
    setLoading(true);
    if (!balance) {
      toast.error('Invalid Balance');
      setLoading(false);
      return;
    }
    if (!walletClient) {
      toast.error('Please connect wallet');
      setLoading(false);
      return;
    }

    const amountInUsdcTokens = parseInt((parseFloat(amount) * 1_000_000).toString());

    if (amountInUsdcTokens > balance) {
      toast.error('Insufficient Balance');
      setLoading(false);
      return;
    }
    let finalReceiverAddress = recieverAddress;
    try {
      if (!isAddress(recieverAddress)) {
        const a = (await (await backendApi()).users.usernameDetail(recieverAddress)).data;
        finalReceiverAddress = a.walletAddress;
      }
      setRecieverAddress(finalReceiverAddress);
      const signData = await getUsdcSignatureData(amountInUsdcTokens);

      const hash = hashTypedData(usdcSignType(signData) as any);

      const signature = await walletClient.signTypedData(usdcSignType(signData) as any);
      const rsv = hexToSignature(signature);

      const trxHash = await (
        await backendApi()
      ).wallet
        .sendUsdcTransactionCreate({
          amount: amountInUsdcTokens,
          deadline: parseInt(signData.deadline.toString()),
          ethSignedMessageHash: hash,
          r: rsv.r,
          s: rsv.s,
          v: parseInt(rsv.v.toString()),
          receiver: finalReceiverAddress,
        })
        .then((res) => res.data.hash);

      toast.success(<TransactionToast hash={trxHash} title="Transaction Successful" />, {
        duration: 6000,
      });
      await refetch();

      window.location.reload();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      /* eslint-disable */
      toast.error(e.message);
      console.log({ e });
    }
    setLoading(false);
  }, [recieverAddress, amount, balance]);
  const clipboard = useClipboard({ timeout: 500 });

  const copyWalletAddresToClipboard = () => {
    clipboard.copy(wallet?.address ?? '');
    toast('Wallet Address Copied To Clipboard');
  };
  const buyCrypto = () => {
    wallet?.fund({
      config: {
        //@ts-ignore
        currencyCode: 'ETH_OPTIMISM', // Purchase ETH on Ethereum mainnet
        quoteCurrencyAmount: 0.05, // Purchase 0.05 ETH
        // paymentMethod: 'credit_debit_card', // Purchase with credit or debit card
        uiConfig: { accentColor: '#696FFD', theme: 'light' }, // Styling preferences for MoonPay's UIs
      },
      provider: 'moonpay',
    });
  };

  const buyCryptoWithOnramper = () => {
    copyWalletAddresToClipboard();
    open();
  };

  const buyCryptoWithChangeNow = () => {
    copyWalletAddresToClipboard();
    openChangeNow();
  };

  const hasEmbeddedWallet = !!user?.linkedAccounts.find(
    (account) => account.type === 'wallet' && account.walletClient === 'privy',
  );
  return (
    <Group mt="sm" p="sm">
      <Modal
        opened={opened}
        onClose={close}
        title="Onrammper Buy ETH on Optimism"
        fullScreen
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <Flex align="center" direction={'column'}>
          <Text>Wallet Address :</Text>
          <Flex align={'center'}>
            <Badge size="lg" variant="light" color="primary.2" my="sm">
              {wallet?.address}
            </Badge>
            <CopyButton value={wallet?.address ?? 'wallet-null'}>
              {({ copied, copy }) => (
                <ActionIcon
                  ml="md"
                  onClick={copy}
                  style={{
                    backgroundColor: copied ? '#3d4070' : '#3d4070',
                  }}
                >
                  {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                </ActionIcon>
              )}
            </CopyButton>
          </Flex>

          <iframe
            src={`https://buy.onramper.com?apiKey=pk_prod_01HKCG8FGCY3QA5EAZAJYRG6GH&mode=buy&onlyCryptos=eth_optimism&wallets=eth_optimism:${wallet?.address}&onlyCryptoNetworks=base`}
            title="Onramper Widget"
            height="630px"
            width="420px"
            allow="accelerometer; autoplay; camera; gyroscope; payment"
          />
        </Flex>
      </Modal>
      <Modal
        opened={openedChangeNow}
        onClose={closeChangeNow}
        title="Change Now Buy ETH on Optimism"
        fullScreen
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        {/* <iframe
          id="iframe-widget"
          src="https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=true&amount=2000&amountFiat=1500&backgroundColor=FFFFFF&darkMode=false&from=usdtop&fromFiat=eur&horizontal=true&isFiat&lang=en-US&link_id=1608fc18eda548&locales=true&logo=true&primaryColor=00C26F&to=ethop&toFiat=eth&toTheMoon=true"
          style={{
            height: '205px',
            width: '100%',
            border: 'none',
          }}
        ></iframe>
        <script
          defer
          type="text/javascript"
          src="https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js"
        ></script> */}
        {/* <Box w={{ maxWidth: 300 }} mx="auto">
          <NumberInput
            label="ETH"
            placeholder="Amount in ETH"
            value={ethAmount}
            onChange={handleEthChange}
            step={0.01}
          />

          <NumberInput
            label="USD"
            placeholder="Amount in USD"
            value={usdAmount}
            onChange={handleUsdChange}
            mt="md"
            step={1}
          />

          <Button onClick={handleBuy} mt="md">
            Buy
          </Button>
        </Box> */}

        <Flex align="center" direction={'column'}>
          <Text>Wallet Address :</Text>
          <Flex align={'center'}>
            <Badge size="lg" variant="light" color="primary.2" my="sm">
              {wallet?.address}
            </Badge>
            <CopyButton value={wallet?.address ?? 'wallet-null'}>
              {({ copied, copy }) => (
                <ActionIcon
                  ml="md"
                  onClick={copy}
                  style={{
                    backgroundColor: copied ? '#3d4070' : '#3d4070',
                  }}
                >
                  {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                </ActionIcon>
              )}
            </CopyButton>
          </Flex>

          <iframe
            style={{
              marginInline: 'auto',
            }}
            height="280"
            title="Guardarian Widget"
            src="https://guardarian.com/calculator/v1?partner_api_token=4203ec36-1b62-4e80-b850-8d5b69f16bcc&theme=blue&type=narrow&default_fiat_currency=USD&default_crypto_currency=ETH_OP&side_toggle_disabled=true&crypto_currencies_list=%5B%7B%22ticker%22%3A%22ETH%22%2C%22network%22%3A%22OP%22%7D%5D"
          />
        </Flex>
      </Modal>
      {appUser ? (
        <Stack>
          <Badge variant="light" radius="md">
            Address : {wallet?.address}
          </Badge>
          <Badge size="lg" color="green" radius="md">
            Balance :{' '}
            {balance ? (parseInt(balance.toString()) / 1_000_000).toFixed(3) : 0} USDC
          </Badge>
          {/* Total Amount Raised */}
          <Text>Network : {chain.name.toUpperCase()}</Text>
          <Input
            placeholder="Receiver Address or Username"
            value={recieverAddress}
            onChange={(e) => {
              setRecieverAddress(e.currentTarget.value);
            }}
          />
          <NumberInput
            label=""
            placeholder="Enter amount"
            allowDecimal
            allowNegative={false}
            defaultValue={0}
            value={amount}
            max={balance ? parseInt(balance.toString()) / 1_000_000 : 0}
            onChange={(value) => {
              setAmount(value.toString());
            }}
          />
          <Button
            disabled={loading}
            onClick={async () => {
              await handleSend();
            }}
          >
            Send
          </Button>
          <Button
            onClick={async () => {
              await buyCrypto();
            }}
          >
            Buy Crypto Using Moon Pay
          </Button>
          {/* <Button
            onClick={async () => {
              buyCryptoWithOnramper();
            }}
          >
            Buy Crypto Using Onramper
          </Button> */}
          <Button
            onClick={async () => {
              buyCryptoWithChangeNow();
            }}
          >
            Buy Crypto Using Change Now
          </Button>

          {hasEmbeddedWallet && (
            <Button onClick={exportWallet} disabled={!hasEmbeddedWallet}>
              Export my wallet
            </Button>
          )}
        </Stack>
      ) : null}
    </Group>
  );
}
