import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Divider,
  Flex,
  Menu,
  Pill,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import Link from 'next/link';
import useAppUser from '../hooks/useAppUser';

export default function HeaderLayout() {
  const { user, ready } = usePrivy();
  const { appUser, logoutUser } = useAppUser();
  const { wallet, ready: walletReady } = usePrivyWagmi();
  console.log({ wallet }, 'walletttttttttttt');
  const displayAddress = (address: string) => {
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };

  return (
    <Flex
      ml="md"
      justify="space-between"
      align="center"
      visibleFrom="sm"
      className="w-[90%]"
      pr="md"
    >
      <Flex gap="xl">
        <Link href="/" className="font-bold">
          HOME
        </Link>
        <Menu withArrow shadow="md" position="bottom" trigger="hover">
          <Menu.Target>
            <Link href="/prize/explore" className="pl-3 font-bold">
              PRIZES
            </Link>
          </Menu.Target>
          <Menu.Dropdown>
            <Stack gap="md" p="md">
              <Menu.Item>
                <Link href="/prize/about">
                  <Text>About</Text>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/prize/explore">
                  <Text>Explore Prizes</Text>
                </Link>
              </Menu.Item>
              <Divider />
              <Button>
                <Link href="/prize/create">Create Prize</Link>
              </Button>
            </Stack>
          </Menu.Dropdown>
        </Menu>

        <Menu withArrow shadow="md" position="bottom" trigger="hover">
          <Menu.Target>
            <Link href="/portal/explore" className="pl-3 font-bold">
              PORTALS
            </Link>
          </Menu.Target>
          <Menu.Dropdown>
            <Stack gap="md" p="md">
              <Menu.Item>
                <Link href="/portal/about">
                  <Text>About</Text>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/portal/explore">
                  <Text>Explore Portals</Text>
                </Link>
              </Menu.Item>
              <Divider />
              <Button>
                <Link href="/portal/create">Create Portal</Link>
              </Button>
            </Stack>
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <Pill color="red" size="lg" radius="xs" className="lg:block hidden">
        Live On OP Mainnet Only (Multichain Coming Soon)
      </Pill>

      <Flex gap="sm" align="center">
        <Card className="hidden sm:block py-1 my-2">
          {user?.wallet ? displayAddress(user.wallet.address) : 'No Wallet'}
          {user?.wallet ? (
            <CopyButton value={user.wallet.address}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon
                    ml="md"
                    onClick={copy}
                    style={{
                      backgroundColor: copied ? '#3d4070' : '#3d4070',
                    }}
                  >
                    {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          ) : null}
        </Card>
      </Flex>
    </Flex>
  );
}
