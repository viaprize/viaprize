'use client';
import { chain } from '@/lib/wagmi';
import {
  AppShell,
  Burger,
  Button,
  Center,
  Flex,
  Modal,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { optimism } from '@wagmi/chains';
import { switchNetwork } from '@wagmi/core';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import Footer from './footer';
import HeaderLayout from './headerLayout';
import MobileNavbar from './mobileNavbar';
import ProfileMenu from './profilemenu';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const [openedChainModal, { open: openChainModal, close: closeChainModal }] =
    useDisclosure(false);
  const computedColorScheme = useComputedColorScheme('light');
  useEffect(() => {
    if (chain.id !== optimism.id) {
      openChainModal();
    }
  }, [chain.id]);
  const switchToOptimism = async () => {
    await switchNetwork({
      chainId: 1,
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
          <ProfileMenu />
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <MobileNavbar close={toggle} open={opened} />
      </AppShell.Navbar>
      <AppShell.Main>
        <div className="w-full flex justify-center">
          <Center className="max-w-screen-xl w-full">{children}</Center>
        </div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
