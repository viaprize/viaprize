'use client';
import {
  ActionIcon,
  AppShell,
  Burger,
  Center,
  Flex,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import useIsMounted from '../hooks/useIsMounted';
import Footer from './footer';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();

  const [opened, { toggle }] = useDisclosure();

  const [openedChainModal, { open: openChainModal, close: closeChainModal }] =
    useDisclosure(false);
  const computedColorScheme = useComputedColorScheme('light');
  const isMounted = useIsMounted();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
      styles={{
        main: {
          background:
            computedColorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
    >
      <AppShell.Header
        p="md"
        py="lg"
        bg={computedColorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]}
      >
        <Flex justify="space-between" h="100%" px="md" className="w-full" align="center">
          <div className="flex justify-between items-center">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" mr="md" />
            <Link href="/">
              <Image src="/viaprizeBg.png" width={30} height={30} alt="home" />
            </Link>
          </div>
          <div className="flex gap-2 items-center">
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
          </div>
          <ConnectButton />
        </Flex>
      </AppShell.Header>

      <AppShell.Main>
        <div className="w-full flex justify-center min-w-0">
          <Center className="max-w-screen-xl w-full">{children}</Center>
        </div>
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}
