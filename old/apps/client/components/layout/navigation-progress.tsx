'use client';
import { useMantineTheme } from '@mantine/core';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import type { ReactNode } from 'react';

function NavigationProvider({ children }: { children: ReactNode }) {
  const { colors } = useMantineTheme();

  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color={colors.gray[4]}
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}

export default NavigationProvider;
