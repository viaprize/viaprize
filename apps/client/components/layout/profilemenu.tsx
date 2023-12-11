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
export default ProfileMenu;
