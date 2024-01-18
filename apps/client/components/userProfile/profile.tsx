import useAppUser from '@/components/hooks/useAppUser';
import { chain } from '@/lib/wagmi';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
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
import { useQuery } from 'react-query';
import { toast } from 'sonner';
import { isAddress, parseEther } from 'viem';
import { useBalance } from 'wagmi';
import { useUser } from '../hooks/useUser';
import EditProfileModal from './edit-profile-modal';

export default function Profile() {
  // const { address } = useAccount();
  const [opened, { open, close }] = useDisclosure(false);
  const { appUser } = useAppUser();
  const { getUserByUserName } = useUser();

  const { data: userData, refetch: fetchUser } = useQuery('result', () =>
    getUserByUserName(appUser?.username || ''),
  );

  console.log(userData, appUser?.username, 'ksdjf');
  // console.log(isAddress(recieverAddress), "ksdjf")
  // const { data, isLoading, refetch } = useBalance({ address });
  return (
    <Card
      shadow="md"
      className="w-full min-w-0 flex flex-col md:flex-row justify-center gap-3"
    >
      <div className="md:p-8 p-3">
        <div>
          <Avatar radius="full" size="xl" src={userData?.avatar} />
          <Text fw={700} size="xl" className="mb-0 uppercase mt-4">
            {userData?.name}
          </Text>
          <Group justify="space-between">
            <Text className="lg my-0">@{appUser?.username}</Text>
            <Button size="xs" onClick={open}>
              Edit Profile
            </Button>
            <Modal opened={opened} onClose={close} title="Edit Profile">
              <EditProfileModal
                IBio={userData?.bio || ''}
                IName={userData?.name || ''}
                IProficiencies={userData?.proficiencies || []}
                IPriorities={userData?.priorities || []}
                IAvatar={userData?.avatar || ''}
                fetchUser={fetchUser}
                closeModal={close}
              />
            </Modal>
          </Group>
        </div>

        <div>
          <h1 className="mb-0 text-xl font-bold">Bio</h1>
          <p className="my-0">{userData?.bio}</p>
        </div>

        <Box mt="md">
          <Text fw={700} mb="sm" mt="md" className="pl-1">
            Proficiencies
          </Text>
          <div className="flex flex-wrap gap-1">
            {userData?.proficiencies.map((proficiency: string) => (
              <Badge key={proficiency} variant="light" color="green">
                {proficiency}
              </Badge>
            ))}
          </div>

          <Text fw={700} mb="sm" mt="md" className="pl-1">
            Priorities
          </Text>
          <div className="flex flex-wrap gap-1">
            {userData?.priorities.map((priority: string) => (
              <Badge key={priority} variant="light" color="blue">
                {priority}
              </Badge>
            ))}
          </div>
        </Box>
      </div>
      <SendCard />
    </Card>
  );
}

function SendCard() {
  const { appUser } = useAppUser();
  const [recieverAddress, setRecieverAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const { wallet } = usePrivyWagmi();
  const [loading, setLoading] = useState(false);

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

  return (
    <Group mt="sm" p="sm">
      {appUser && balance ? (
        <Stack>
          <Text>
            Address : {wallet?.address.slice(0, 6)}.....{wallet?.address.slice(-6)}
          </Text>
          <Text>
            Balance : {balance.formatted} {balance.symbol}
          </Text>
          Total Amount Raised
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
        </Stack>
      ) : null}
    </Group>
  );
}
