import useAppUser from '@/context/hooks/useAppUser';
import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Flex,
  Group,
  Stack,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useWallets } from '@privy-io/react-auth';
import { IconCheck, IconCopy, IconMoonStars, IconSun } from '@tabler/icons-react';
import Link from 'next/link';

export default function MobileNavbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const { wallets } = useWallets();
  const displayAddress = (address: string) => {
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };
  const { appUser } = useAppUser();

  return (
    <div>
      <Stack gap="md">
        <Link href="/" className="pl-5 font-bold">
          HOME
        </Link>
        <Link href="/prize/explore" className="pl-3 font-bold">
          PRIZES
        </Link>
        <Link href="/portal/explore" className="pl-3 font-bold">
          PORTALS
        </Link>
        {appUser ? (
          <Link className="pl-3 font-bold" href={`/profile/${appUser.username}`}>
            PROFILE
          </Link>
        ) : null}
        <Button className="w-[40%]" color="primary">
          <Link href="/portal/create">Create Portals</Link>
        </Button>
        <Button className="w-[40%]" color="primary">
          <Link href="/prize/create">Create Prize</Link>
        </Button>
      </Stack>
    </div>
  );
}
