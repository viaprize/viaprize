'use client';
import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Center,
  Flex,
  Modal,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { optimism } from '@wagmi/chains';
import { switchNetwork } from '@wagmi/core';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import { useNetwork } from 'wagmi';
import useIsMounted from '../hooks/useIsMounted';
import Footer from './footer';
import HeaderLayout from './headerLayout';
import MobileNavbar from './mobileNavbar';
import ProfileMenu from './profilemenu';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();
  const { chain: currentChain } = useNetwork();
  const [opened, { toggle }] = useDisclosure();
  const { wallets } = useWallets();
  const [openedChainModal, { open: openChainModal, close: closeChainModal }] =
    useDisclosure(false);
  const computedColorScheme = useComputedColorScheme('light');
  const isMounted = useIsMounted();
  const { ready } = usePrivy();
  useEffect(() => {
    if (currentChain?.id !== optimism.id && wallets[0] && wallets[0].address && ready) {
      openChainModal();
    }
  }, [currentChain, isMounted, ready]);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const switchToOptimism = async () => {
    await switchNetwork({
      chainId: optimism.id,
    }).then(() => {
      closeChainModal();
    });
  };
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
      <Modal
        opened={openedChainModal}
        onClose={closeChainModal}
        withCloseButton={false}
        size="sm"
        centered
        closeOnClickOutside={false}
        title="Wrong Network"
      >
        <Button onClick={() => switchToOptimism()}> Switch To Optimism</Button>
      </Modal>
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
          <HeaderLayout />
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
            <ProfileMenu />
          </div>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <MobileNavbar close={toggle} open={opened} />
      </AppShell.Navbar>
      <AppShell.Main>
        <div className="w-full flex justify-center min-w-0">
          <Center className="max-w-screen-xl w-full">{children}</Center>
        </div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
