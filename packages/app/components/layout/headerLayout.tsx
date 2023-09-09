import React, { forwardRef } from 'react';
import { Avatar, Popover, Button, Paper, Text, Group, Menu, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { IconArrowsLeftRight, IconChevronRight, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash, IconUser } from '@tabler/icons-react';
import { IoMdContact } from 'react-icons/io';

export default function HeaderLayout() {
  const { logout } = usePrivy();

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
  return (
    <Group position="center">
      <Menu withArrow>
        <Menu.Target>
          <Avatar color="cyan" radius="xl" className="cursor-pointer">
            MK
          </Avatar>
        </Menu.Target>
        <Menu.Dropdown p="md" mr="sm">
          <Menu.Label>Profile</Menu.Label>
          <Menu.Item icon={<IconUser size={14} />}>View Profile</Menu.Item>
          {/* <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
          <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item> */}
          <Menu.Item
            icon={<IconSearch size={14} />}
            rightSection={
              <Text size="xs" color="dimmed">
                ⌘K
              </Text>
            }
          >
            Search
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          {/* <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item> */}
          <Menu.Item color="red" icon={<IconTrash size={14} />}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
