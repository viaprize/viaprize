import '../styles/globals.css';
import '../styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { Web3ContextProvider } from '@/context/Web3Context';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { WagmiConfig, configureChains } from 'wagmi';
import wagmiConfig from '@/lib/wagmi';
import Header from '@/components/layout/headerLayout';
import { mainnet, goerli, optimism } from '@wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'sonner';

const configureChainsConfig = configureChains([mainnet, goerli], [publicProvider()]);
const queryClient = new QueryClient();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // console.log(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  const handleLogin = (user: any) => {
    // console.log(`User ${user.id} logged in!`);
  };

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Mantine next example</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ' '}
        onSuccess={handleLogin}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            showWalletLoginFirst: true,
            // logo: 'https://your-logo-url',
          },
        }}
      >
        <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
          <Web3ContextProvider>
            <QueryClientProvider client={queryClient}>
              <MantineProvider theme={{}} withGlobalStyles withNormalizeCSS>
                <Toaster />

                {getLayout(<Component {...pageProps} />)}
              </MantineProvider>
            </QueryClientProvider>
          </Web3ContextProvider>
        </PrivyWagmiConnector>
      </PrivyProvider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};
