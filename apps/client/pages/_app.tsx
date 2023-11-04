import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';

import type { AppContext, AppProps } from 'next/app';
import NextApp from 'next/app';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import '../styles/index.css';

import { configureChainsConfig } from '@/lib/wagmi';
import { env } from '@env';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import { optimism, optimismGoerli } from 'wagmi/chains';

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/ban-types -- required for Next.js
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const theme = createTheme({
  /** Your theme override here */
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // console.log(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>ViaPrize</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/viaprizeBg.png" />
      </Head>
      <PrivyProvider
        appId={env.NEXT_PUBLIC_PRIVY_APP_ID || ' '}
        config={{
          loginMethods: ['email', 'wallet'],
          additionalChains: [optimism, optimismGoerli],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            showWalletLoginFirst: true,
            // logo: 'https://your-logo-url',
          },
        }}
      >
        <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
          <QueryClientProvider client={queryClient}>
            <ColorSchemeScript defaultColorScheme="auto" />
            <MantineProvider theme={theme} defaultColorScheme="auto">
              <Toaster />
              {getLayout(<Component {...pageProps} />)}
            </MantineProvider>
          </QueryClientProvider>
        </PrivyWagmiConnector>
      </PrivyProvider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
  };
};
