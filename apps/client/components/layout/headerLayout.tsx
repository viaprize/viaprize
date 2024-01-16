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
  useMantineColorScheme,
} from '@mantine/core';
import { usePrivy } from '@privy-io/react-auth';
import { IconCheck, IconCopy, IconMoonStars, IconSun } from '@tabler/icons-react';
import Link from 'next/link';

export default function HeaderLayout() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const { user } = usePrivy();
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
              PRIZE
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
      <Pill color="red" size="lg" radius="xs">
        Live On OP Mainnet Only (Multichain Coming Soon)
      </Pill>

      <Flex gap="md" align="center">
        <Card className="hidden sm:block py-1 my-2">
          {user && user.wallet ? displayAddress(user?.wallet?.address) : 'No Wallet'}
          {user && user.wallet ? (
            <CopyButton value={user?.wallet?.address}>
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
      </Flex>
    </Flex>
  );
}
