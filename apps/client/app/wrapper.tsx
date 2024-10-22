'use client';

import NavigationProvider from '@/components/layout/navigation-progress';
import { config } from '@/lib/wagmi';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/tiptap/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { theme } from 'utils/theme';
import { WagmiProvider } from 'wagmi';
import '../styles/globals.css';
import '../styles/index.css';
import '@rainbow-me/rainbowkit/styles.css';
export const queryClient = new QueryClient();

export default function WrapperLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <MantineProvider theme={theme} defaultColorScheme="auto">
              <ModalsProvider>
                <Toaster richColors />
                <NavigationProvider>{children}</NavigationProvider>
              </ModalsProvider>
            </MantineProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
