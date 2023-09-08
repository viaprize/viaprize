import '../styles/globals.css';
import '../styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme } from '@mantine/core';
import { PrivyProvider } from '@privy-io/react-auth';

import { WagmiConfig } from 'wagmi';
import { Web3ContextProvider } from '@/context/Web3Context';
import wagmiConfig from '@/lib/wagmi';
import Header from '@/components/layout/headerLayout';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  console.log(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  const handleLogin = (user: any) => {
    // console.log(`User ${user.id} logged in!`);
  };

  // const {open} = usePrivy();
  // const opening = open()

  // // Call the open function inside a useEffect hook
  // // to open the login popup when the component mounts
  // useEffect(() => {
  //   opening();
  // }, [open]);

  // useEffect(() => {
  //   usePrivy()
  // })

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Header />
      <Head>
        <title>Mantine next example</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <WagmiConfig config={wagmiConfig}>
        <Web3ContextProvider>
          <MantineProvider theme={{}} withGlobalStyles withNormalizeCSS>
            <PrivyProvider
              appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ' '}
              onSuccess={handleLogin}
              config={{
                loginMethods: ['email', 'wallet'],
                appearance: {
                  theme: 'light',
                  accentColor: '#676FFF',
                  // This configures your login modal to show wallet login options above other options.
                  showWalletLoginFirst: true,
                  // logo: 'https://your-logo-url',
                },
              }}
            >
              {getLayout(<Component {...pageProps} />)}
            </PrivyProvider>
          </MantineProvider>
        </Web3ContextProvider>
      </WagmiConfig>
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
