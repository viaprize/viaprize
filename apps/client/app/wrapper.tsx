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
            logo: 'https://www.viaprize.org/_next/image?url=%2FviaprizeBg.png&w=64&q=75',

            // logo: 'https://your-logo-url',
          },
        }}
      >
        <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
          <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme} defaultColorScheme="auto">
              <ModalsProvider>
                <Toaster richColors />
                <NavigationProvider>{children}</NavigationProvider>
              </ModalsProvider>
            </MantineProvider>
          </QueryClientProvider>
        </PrivyWagmiConnector>
      </PrivyProvider>
    </div>
  );
}
