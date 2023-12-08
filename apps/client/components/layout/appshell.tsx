'use client';
import { AppShell, Center, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import type { ReactNode } from 'react';
import HeaderLayout from './headerLayout';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();

  const computedColorScheme = useComputedColorScheme('light');

  return (
    <AppShell
      header={{
        height: 50,
      }}
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
        <div
          style={{ display: 'flex', alignItems: 'center', height: '100%', width: '90%' }}
        >
          {/* {A Burger was here } */}
          <HeaderLayout />
        </div>
      </AppShell.Header>

      <AppShell.Main>
        <div className="w-full grid place-content-center">
          <Center className="max-w-screen-xl">{children}</Center>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
