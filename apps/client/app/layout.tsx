'use client'

import { MantineProvider, createTheme } from '@mantine/core';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { PrivyProvider } from '@privy-io/react-auth';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';
import '../styles/globals.css';
import '../styles/index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import { env } from '@env';
import { configureChainsConfig } from '@/lib/wagmi';
import { SpeedInsights } from '@vercel/speed-insights/next';

const queryClient = new QueryClient();

const theme = createTheme({
  /** Your theme override here */
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
                <Toaster />
                {children}
              </MantineProvider>
            </QueryClientProvider>
          </PrivyWagmiConnector>
        </PrivyProvider>
      </body>
    </html>
  );
}
