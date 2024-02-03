'use client';

import NavigationProvider from '@/components/layout/navigation-progress';
import { configureChainsConfig } from '@/lib/wagmi';
import { env } from '@env';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/tiptap/styles.css';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import { theme } from 'utils/theme';
import '../styles/globals.css';
import '../styles/index.css';

const queryClient = new QueryClient();

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SpeedInsights />
        <PrivyProvider
          appId={env.NEXT_PUBLIC_PRIVY_APP_ID || ' '}
          config={{
            loginMethods: ['email', 'wallet'],
            additionalChains: [],

            defaultChain: configureChainsConfig.chains[0],
            appearance: {
              theme: 'dark',
              accentColor: '#676FFF',
              showWalletLoginFirst: true,

              // logo: 'https://your-logo-url',
            },
          }}
        >
          <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
            <QueryClientProvider client={queryClient}>
              <MantineProvider theme={theme} defaultColorScheme="auto">
                <ModalsProvider>
                  <Toaster />
                  <NavigationProvider>{children}</NavigationProvider>
                </ModalsProvider>
              </MantineProvider>
            </QueryClientProvider>
          </PrivyWagmiConnector>
        </PrivyProvider>
      </body>
    </html>
  );
}
