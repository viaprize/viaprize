import useAppUser from '@/components/hooks/useAppUser';
import { Avatar, Button, Menu, Modal } from '@mantine/core';
import { IconArrowsLeftRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { IoExit } from 'react-icons/io5';
import { TbTopologyStarRing2 } from 'react-icons/tb';
import { toast } from 'sonner';
import SwitchAccount from './switchWallet';

function ProfileMenu() {
  const { logoutUser, appUser, loginUser } = useAppUser();

  const [switchWallet, setSwitchWallet] = useState(false);
  const handleLogout = () => {
    try {
      toast.promise(logoutUser(), {
        loading: 'Logging out',
        success: 'Logged out',
      });
    } catch {
      console.error('Error logging out');
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
