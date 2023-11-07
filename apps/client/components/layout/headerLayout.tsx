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
  useMantineColorScheme
} from '@mantine/core';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  IconArrowsLeftRight,
  IconCheck,
  IconCopy,
  IconMoonStars,
  IconSun,
  IconUser
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoExit } from 'react-icons/io5';
import { toast } from 'sonner';
import SwitchAccount from './switchWallet';

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

  return (
    <Group justify="space-between" w="100%" align="center" pos="fixed" px="xl">
      <Flex justify='space-between' align="center" gap={10}>
      <Link href="/">
     <Image src="/viaprizeBg.png" width={30} height={30} alt="home"  />
      </Link>
     <Link href='/' className='ml-2'>
     Home
     </Link>
      <Link href='/prize/explore' >
     Prizes
     </Link>
     </Flex>
      <Flex align="center" gap="md">
          <Link href="/prize/create">
            <Button>
              Create Prize
            </Button>
            </Link>
        <Card py="5px">
          <Group>
          
            {wallets[0] ? displayAddress(wallets[0].address) : 'No Wallet'}
            {wallets[0] ? (
              <CopyButton value={wallets[0].address}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                      {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            ) : null}
          </Group>
        </Card>
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
  const { authenticated } = usePrivy();
  const { logoutUser, appUser } = useAppUser();

  const router = useRouter();
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
      <Group justify="center">
        <Menu withArrow trigger="hover" openDelay={100} closeDelay={400}>
          <Menu.Target>
            {appUser ? (
              <Avatar color='blue' radius="xl" className="cursor-pointer">
              {appUser.username.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar color="cyan" radius="xl" className="cursor-pointer" />
            )}
          </Menu.Target>
          <Menu.Dropdown p="md" mr="sm">
            <Menu.Label>Profile</Menu.Label>
            {authenticated ? (
              <>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  onClick={() => {
                    router
                      .push(`/profile/${appUser?.username}`)
                      .then(console.log)
                      .catch(console.error);
                  }}
                >
                  View Profile
                </Menu.Item>
                {/* <Menu.Item
                  leftSection={<TbTopologyStarRing2 />}
                  onClick={() => {
                    router.push('/prize/create').then(console.log).catch(console.error);
                  }}
                >
                  Create Prize
                </Menu.Item> */}
              </>
            ) : null}

          
            <Menu.Divider />

            {/* <Menu.Label>Danger zone</Menu.Label> */}
            <Menu.Item
              onClick={() => {
                setSwitchWallet(true);
              }}
              rightSection={<IconArrowsLeftRight size={14} />}
            >
              Switch Wallet
            </Menu.Item>
            {authenticated ? (
              <Menu.Item
                color="red"
                leftSection={<IoExit size={14} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            ) : (
              <Menu.Item
                color="green"
                leftSection={<IconUser size={14} />}
                onClick={() => {
                  router.push('/').then(console.log).catch(console.error);
                }}
              >
                Login
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
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
  );
}
