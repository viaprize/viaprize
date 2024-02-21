'use client';

import { chain } from '@/lib/wagmi';
import {
  Badge,
  Button,
  Group,
  Input,
  Modal,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { prepareSendTransaction, sendTransaction, waitForTransaction } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isAddress, parseEther } from 'viem';
import { useBalance } from 'wagmi';
import useAppUser from '../hooks/useAppUser';

export default function SendCard() {
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
    open();
  };

  const buyCryptoWithChangeNow = () => {
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
        <iframe
          src={`https://buy.onramper.com?apiKey=pk_prod_01HKCG8FGCY3QA5EAZAJYRG6GH&mode=buy&onlyCryptos=eth_optimism&wallets=eth_optimism:${wallet?.address}&onlyCryptoNetworks=optimism`}
          title="Onramper Widget"
          height="630px"
          width="420px"
          allow="accelerometer; autoplay; camera; gyroscope; payment"
        />
      </Modal>
      <Modal
        opened={openedChangeNow}
        onClose={closeChangeNow}
        title="Change Now Buy ETH on Optimism"
        fullScreen
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <iframe
          id="iframe-widget"
          src="https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=true&amount=0.1&amountFiat=1500&backgroundColor=FFFFFF&darkMode=false&from=btc&fromFiat=eur&horizontal=false&isFiat=true&lang=en-US&link_id=1608fc18eda548&locales=true&logo=true&primaryColor=00C26F&to=eth&toFiat=eth&toTheMoon=true"
          style={{
            height: '356px',
            width: '100%',
            border: 'none',
          }}
        ></iframe>
        <script
          defer
          type="text/javascript"
          src="https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js"
        ></script>
      </Modal>
      {appUser && balance ? (
        <Stack>
          <Badge variant="light" radius="md">
            Address : {wallet?.address.slice(0, 6)}.....{wallet?.address.slice(-6)}
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
