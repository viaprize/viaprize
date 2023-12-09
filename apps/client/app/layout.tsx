'use client';

import { env } from '@env';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Router } from 'next/router';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import { OwnLoader } from '@/components/custom/loader';
import { configureChainsConfig } from '@/lib/wagmi';
import '../styles/globals.css';
import '../styles/index.css';
import { theme } from 'utils/theme';

const queryClient = new QueryClient();


export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      console.log('Route change started');
      // Set your loading state here
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      console.log('Route change completed');
      // Unset your loading state here
      setLoading(false);
    };

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

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

                {loading ? <OwnLoader /> : children}
              </MantineProvider>
            </QueryClientProvider>
          </PrivyWagmiConnector>
        </PrivyProvider>
      </body>
    </html>
  );
}
