import useAppUser from '@/context/hooks/useAppUser';
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  CopyButton,
  Flex,
  Group,
  Menu,
  Modal,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useWallets } from '@privy-io/react-auth';
import {
  IconArrowsLeftRight,
  IconCheck,
  IconCopy,
  IconMoonStars,
  IconSun,
  IconUser,
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IoExit } from 'react-icons/io5';
import { TbTopologyStarRing2 } from 'react-icons/tb';
import { toast } from 'sonner';
import SwitchAccount from './switchWallet';
import { useDisclosure } from '@mantine/hooks';

// function getEmailInitials(email: string) {
//   const [username, domain] = email.split('@');
//   if (!username || !domain) {
//     return '??';
//   }
//   const usernameInitial = username.charAt(0);
//   const domainInitial = domain.charAt(0);

//   return usernameInitial + domainInitial;
// }

export default function HeaderLayout() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const { wallets } = useWallets();
  const displayAddress = (address: string) => {
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  };
  const { appUser } = useAppUser();

  return (
    <Group
      justify="space-between"
      align="center"
      pos="fixed"
      visibleFrom="sm"
      className="sm:px-12 px-3 sm:w-full w-[90%]"
    >
      <Flex justify="space-between" align="center" gap={10}>
        <Link href="/" className="pl-5 font-bold">
          HOME
        </Link>
        <Link href="/prize/explore" className="pl-3 font-bold">
          PRIZES
        </Link>
        <Link href="/portal/explore" className="pl-3 font-bold">
          PORTALS
        </Link>
      </Flex>
      <Flex align="center" gap="md">
        <Button className="hidden sm:block " color="primary">
          <Link href="/portal/create">Create Portals</Link>
        </Button>
        <Button className="hidden sm:block " color="primary">
          <Link href="/prize/create">Create Prize</Link>
        </Button>
        {appUser ? (
          <Card py="5px" className="hidden sm:block">
            <Group>
              {wallets[0] ? displayAddress(wallets[0].address) : 'No Wallet'}
              {wallets[0] ? (
                <CopyButton value={wallets[0].address}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? 'Copied' : 'Copy'}
                      withArrow
                      position="right"
                    >
                      <ActionIcon
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
            </Group>
          </Card>
        ) : null}

        <ActionIcon
          variant="outline"
          color={colorScheme === 'dark' ? 'yellow.7' : 'blue.8'}
          onClick={() => {
            toggleColorScheme();
          }}
          title="Toggle color scheme"
        >
          {colorScheme === 'dark' ? (
            <IconSun size="1.1rem" />
          ) : (
            <IconMoonStars size="1.1rem" />
          )}
        </ActionIcon>
        <ProfileMenu />
      </Flex>
    </Group>
  );
}

function ProfileMenu() {
  const { logoutUser, appUser, loginUser } = useAppUser();

  const [switchWallet, setSwitchWallet] = useState(false);
  const handleLogout = () => {
    try {
      toast.promise(logoutUser(), {
        loading: 'Logging out',
        success: 'Logged out',
        error: 'Error logging out',
      });
    } catch {
      toast.error('Error logging out');
    }
  };

  return (
    <>
      {appUser ? (
        <>
          <Menu withArrow trigger="hover" openDelay={100} closeDelay={400}>
            <Menu.Target>
              <Avatar color="blue" radius="xl" className="cursor-pointer">
                {appUser.username.charAt(0).toUpperCase()}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown p="md" mr="sm">
              <Menu.Label>Profile</Menu.Label>
              <Menu.Item
                leftSection={<IconUser size={14} />}
                // onClick={() => {
                //   router
                //     .push(`/profile/${appUser?.username}`)
                //     .then(console.log)
                //     .catch(console.error);
                // }}
              >
                <Link href={`/profile/${appUser.username}`}>View Profile</Link>
              </Menu.Item>
              <Menu.Item leftSection={<TbTopologyStarRing2 />} className="sm:hidden">
                <Link href="/prize/create" className="block">
                  Create Prize
                </Link>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={() => {
                  setSwitchWallet(true);
                }}
                rightSection={<IconArrowsLeftRight size={14} />}
              >
                Switch Wallet
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IoExit size={14} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Modal
            size="lg"
            opened={switchWallet}
            onClose={() => {
              setSwitchWallet(false);
            }}
            title="Switch Wallets"
          >
            <SwitchAccount />
          </Modal>
        </>
      ) : (
        <Button
          color="primary"
          onClick={() => {
            void loginUser();
          }}
        >
          Login
        </Button>
      )}
    </>
  );
}
