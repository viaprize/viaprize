import "../styles/globals.css";
import "../styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { Web3ContextProvider } from "@/context/Web3Context";
import {PrivyProvider} from '@privy-io/react-auth';

import { WagmiConfig, configureChains, mainnet } from 'wagmi'
import wagmiConfig from "@/lib/wagmi";
import { usePrivy } from '@privy-io/react-auth';




export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  console.log(process.env.NEXT_PUBLIC_PRIVY_APP_ID)
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  const handleLogin = (user: any) => {
    console.log(`User ${user.id} logged in!`)
  }

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



  return (
    <>
      <Head>
        <title>Mantine next example</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <WagmiConfig config={wagmiConfig}>
          <Web3ContextProvider>
            <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <PrivyProvider
              appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ' ' }
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
              <Component {...pageProps} />
              </PrivyProvider>
            </MantineProvider>
          </Web3ContextProvider>
        </WagmiConfig>
      </ColorSchemeProvider>
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
