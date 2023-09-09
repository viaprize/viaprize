import React, { forwardRef } from 'react';
import {
  Avatar,
  Popover,
  Button,
  Paper,
  Text,
  Group,
  Menu,
  UnstyledButton,
  Badge,
} from '@mantine/core';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import {
  IconArrowsLeftRight,
  IconChevronRight,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { IoMdContact } from 'react-icons/io';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

export default function HeaderLayout() {
  return (
    <div className="bg-black h-[70px]">
      <div className="absolute right-0 m-4">
        {/* <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Avatar color="cyan" radius="xl">
              MK
            </Avatar>
          </Popover.Target>
          <Popover.Dropdown>
            <Link href="/profile">view Profile</Link>
            <Button variant="link" color="red" onClick={logout}>
              Logout
            </Button>
          </Popover.Dropdown>
        </Popover> */}
        <ProfileMenu />
      </div>
    </div>
  );
}

function ProfileMenu() {
  const { logout, user } = usePrivy();
  const router = useRouter();

  const handleLogout = () => {
    try {
      toast.promise(logout(), {
        loading: 'Logging out',
        success: 'Logged out',
        error: 'Error logging out',
      });
    } catch {
      toast.error('Error logging out');
    }
  };
  return (
    <Group position="center">
      <Menu withArrow trigger="hover" openDelay={100} closeDelay={400}>
        <Menu.Target>
          {user ? (
            <Badge
              color="dark"
              variant="filled"
              size="xl"
              className="absolute top-0 right-0 cursor-pointer"
            >
              {user?.wallet?.address?.slice(0, 4) + '...' + user?.wallet?.address?.slice(-4)}
            </Badge>
          ) : (
            <Avatar color="cyan" radius="xl" className="cursor-pointer" />
          )}
        </Menu.Target>
        <Menu.Dropdown p="md" mr="sm">
          <Menu.Label>Profile</Menu.Label>
          {user ? (
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

          <Menu.Divider />

          {/* <Menu.Label>Danger zone</Menu.Label> */}
          {/* <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item> */}
          {user ? (
            <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={handleLogout}>
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
