'use client';
import { AppShell, Burger, Center, Group, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import type { ReactNode } from 'react';
import Footer from './footer';
import HeaderLayout from './headerLayout';
import MobileNavbar from './mobileNavbar';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import Image from 'next/image';

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
        bg={computedColorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]}
      >
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" mx="md" />
          <Link href="/">
            <Image src="/viaprizeBg.png" width={30} height={30} alt="home" />
          </Link>
          <HeaderLayout />
        </Group>
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
