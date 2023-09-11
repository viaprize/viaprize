import React, { forwardRef } from 'react';
import {
  Avatar,
  Text,
  Group,
  Menu,
  Badge,
  useMantineColorScheme,
  Flex,
  ActionIcon,
  Button,
} from '@mantine/core';
import Link from 'next/link';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  IconMoonStars,
  IconSearch,
  IconSignRight,
  IconSun,
  IconUser,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { IoExit } from 'react-icons/io5';
import useAppUser from '@/context/hooks/useAppUser';

function getEmailInitials(email: string) {
  const [username, domain] = email.split('@');
  const usernameInitial = username.slice(0, 5)
  const domainInitial = domain.charAt(0);
  return usernameInitial + domainInitial;
}

export default function HeaderLayout() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Flex
      justify="space-between"
      align="center"
      sx={{
        width: '100%',
      }}
    >
      <div>Image</div>
      <Flex align="center" gap="md">
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow.7' : 'blue.8'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
        </ActionIcon>
        <ProfileMenu />
      </Flex>
    </Flex>
  );
}

function ProfileMenu() {
  const { authenticated } = usePrivy();
  const {
    logoutUser,
    appUser

  } = useAppUser()

  const router = useRouter();

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
  const { wallets } = useWallets()
  return (
    <Group position="center">
      <Menu withArrow trigger="hover" openDelay={100} closeDelay={400}>
        <Menu.Target>
          {appUser ? (
            <Badge color="dark" variant="filled" size="xl" radius="sm" className="cursor-pointer">
              {getEmailInitials(appUser.email)}
            </Badge>
          ) : (
            <Avatar color="cyan" radius="xl" className="cursor-pointer" />
          )}
        </Menu.Target>
        <Menu.Dropdown p="md" mr="sm">
          <Menu.Label>Profile</Menu.Label>
          {authenticated ? (
            <Menu.Item
              icon={<IconUser size={14} />}
              onClick={() => {
                router.push('/profile');
              }}
            >
              View Profile
            </Menu.Item>
          ) : null}
          {/* <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
          <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item> */}
          <Menu.Item
            icon={<IconSearch size={14} />}
            rightSection={
              <Text size="xs" color="dimmed" pl="sm">
                ⌘K
              </Text>
            }
          >
            Search
          </Menu.Item>
          {/* <Menu.Label>Danger zone</Menu.Label> */}
          {/* <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item> */}
          {authenticated ? (
            <Menu.Item color="red" icon={<IoExit size={14} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          ) : (
            <Menu.Item
              color="green"
              icon={<IconUser size={14} />}
              onClick={() => {
                router.push('/');
              }}
            >
              Login
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
