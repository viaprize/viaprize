'use client';
import {
  AppShell,
  Burger,
  Center,
  Flex,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import Footer from './footer';
import HeaderLayout from './headerLayout';
import MobileNavbar from './mobileNavbar';
import ProfileMenu from './profilemenu';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const computedColorScheme = useComputedColorScheme('light');

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
          <HeaderLayout />
          <ProfileMenu />
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <MobileNavbar />
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
