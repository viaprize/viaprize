'use client';

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
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { prepareSendTransaction, sendTransaction, waitForTransaction } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isAddress, parseEther } from 'viem';
import { useBalance, useQuery } from 'wagmi';
import getCryptoToUsd from '../hooks/server-actions/CryptotoUsd';
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
  const { data: conversionRates } = useQuery(['cryptoToUsd', undefined], async () => {
    const data = await getCryptoToUsd();
    return {
      ethToUsd: data.ethereum.usd,
      usdToEth: 1 / data.ethereum.usd,
    };
  });
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

  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedChangeNow, { open: openChangeNow, close: closeChangeNow }] =
    useDisclosure(false);
  const { data: balance, refetch } = useBalance({
    address: wallet?.address as `0x${string}`,
  });

  useEffect(() => {
    if (!balance) {
      void refetch();
    }
  }, [balance]);

  const handleSend = async () => {
    setLoading(true);
    if (!isAddress(recieverAddress)) {
      toast.error('Invalid Address');
      setLoading(false);
      return;
    }
    if (!balance) {
      toast.error('Invalid Balance');
      setLoading(false);
      return;
    }

    if (parseEther(amount) > balance.value) {
      toast.error('Insufficient Balance');
      setLoading(false);
      return;
    }
    try {
      const config = await prepareSendTransaction({
        to: recieverAddress,
        value: parseEther(amount),
      });
      const { hash } = await sendTransaction(config);
      toast.promise(
        waitForTransaction({
          hash,
        }),
        {
          loading: 'Sending Transaction',
          success: 'Transaction Sent',
          error: 'Error Sending Transaction',
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      /* eslint-disable */
      toast.error(e.message);
    }
    setLoading(false);
  };
  const clipboard = useClipboard({ timeout: 500 });

  const [ethAmount, setEthAmount] = useState<number | string>('');
  const [usdAmount, setUsdAmount] = useState<number | string>('');

  const handleEthChange = (value: number | string) => {
    setEthAmount(value);
    const convertedValue =
      typeof value === 'number' ? value * (conversionRates!.ethToUsd ?? 0) : '';
    setUsdAmount(convertedValue);
  };

  const handleUsdChange = (value: number | string) => {
    setUsdAmount(value);
    const convertedValue =
      typeof value === 'number' ? value * (conversionRates!.usdToEth ?? 0) : '';
    setEthAmount(convertedValue);
  };

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
            src={`https://buy.onramper.com?apiKey=pk_prod_01HKCG8FGCY3QA5EAZAJYRG6GH&mode=buy&onlyCryptos=eth_optimism&wallets=eth_optimism:${wallet?.address}&onlyCryptoNetworks=optimism`}
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
      {appUser && balance ? (
        <Stack>
          <Badge variant="light" radius="md">
            Address : {wallet?.address}
          </Badge>
          <Badge size="lg" color="green" radius="md">
            Balance : {balance.formatted} {balance.symbol}
          </Badge>
          {/* Total Amount Raised */}
          <Text>Network : {chain.name.toUpperCase()}</Text>
          <Input
            placeholder="Receiver Address"
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
            max={parseInt(balance.value.toString() ?? '1000')}
            onChange={(value) => {
              setAmount(value.toString());
            }}
          />
          <Button
            disabled={!isAddress(recieverAddress) || loading}
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
          <Button
            onClick={async () => {
              buyCryptoWithOnramper();
            }}
          >
            Buy Crypto Using Onramper
          </Button>
          <Button
            onClick={async () => {
              buyCryptoWithChangeNow();
            }}
          >
            Buy Crypto Using Change Now
          </Button>
        </Stack>
      ) : null}
    </Group>
  );
}
