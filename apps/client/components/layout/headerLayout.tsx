import useAppUser from '@/context/hooks/useAppUser';
import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Divider,
  Flex,
  Popover,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useWallets } from '@privy-io/react-auth';
import { IconCheck, IconCopy, IconMoonStars, IconSun } from '@tabler/icons-react';
import Link from 'next/link';

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
  const [portalOpened, { close: portalMenuClose, open: portalMenuOpen }] =
    useDisclosure(false);
  const [prizeOpened, { close: prizeMenuClose, open: prizeMenuOpen }] =
    useDisclosure(false);

  return (
    <Flex
      ml="md"
      justify="space-between"
      align="center"
      visibleFrom="sm"
      className="w-[90%] "
    >
      <Flex gap="md">
        <Link href="/" className="font-bold">
          HOME
        </Link>
        <Popover withArrow shadow="md" opened={prizeOpened} position="bottom">
          <Popover.Target>
            <Link
              onMouseEnter={prizeMenuOpen}
              onMouseLeave={prizeMenuClose}
              href="/portal/explore"
              className="pl-3 font-bold"
            >
              PRIZE
            </Link>
          </Popover.Target>
          <Popover.Dropdown>
            <Text>About</Text>
            <Divider />
            <p>y efwjeg wlegr2 ri34br 43iyr034hrn i3oihi3</p>
            <Button>
              <Link href="/prize/create">Create Prize</Link>
            </Button>
          </Popover.Dropdown>
        </Popover>

        <Popover withArrow shadow="md" opened={portalOpened} position="bottom">
          <Popover.Target>
            <Link
              onMouseEnter={portalMenuOpen}
              onMouseLeave={portalMenuClose}
              href="/portal/explore"
              className="pl-3 font-bold"
            >
              PORTAL
            </Link>
          </Popover.Target>
          <Popover.Dropdown>
            <Text>About</Text>
            <Divider />
            <p>y efwjeg wlegr2 ri34br 43iyr034hrn i3oihi3</p>
            <Button>
              <Link href="/prize/create">Create Prize</Link>
            </Button>
          </Popover.Dropdown>
        </Popover>
      </Flex>

      <Flex gap="md">
        {appUser ? (
          <Card className="hidden sm:block">
            {wallets[0] ? displayAddress(wallets[0].address) : 'No Wallet'}
            {wallets[0] ? (
              <CopyButton value={wallets[0].address}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
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
          </Card>
        ) : null}

        <ActionIcon
          variant="outline"
          color={colorScheme === 'dark' ? 'yellow.7' : 'blue.8'}
          onClick={() => {
            toggleColorScheme();
          }}
          title="Toggle color scheme"
          mt="md"
        >
          {colorScheme === 'dark' ? (
            <IconSun size="1rem" />
          ) : (
            <IconMoonStars size="1rem" />
          )}
        </ActionIcon>
      </Flex>
    </Flex>
  );
}
