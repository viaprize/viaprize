import type {
  ColorScheme} from "@mantine/core";
import {
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { getCookie } from "cookies-next";
import type { AppContext, AppProps } from "next/app";
import NextApp from "next/app";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "../styles/index.css";

import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import type { NextPage } from "next";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { optimism, optimismGoerli } from "wagmi/chains";
import { Toaster } from "sonner";
import { env } from "@env";
import { configureChainsConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: Element) => React.JSX.Element;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // console.log(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))
  }
  return (
    <>
      <Head>
        <title>Mantine next example</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <PrivyProvider
        appId={env.NEXT_PUBLIC_PRIVY_APP_ID || " "}
        config={{
          loginMethods: ["email", "wallet"],
          additionalChains: [optimism, optimismGoerli],
          appearance: {
            theme: "light",
            accentColor: "#676FFF",
            showWalletLoginFirst: true,
            // logo: 'https://your-logo-url',
          },
        }}
      >
        <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
          <QueryClientProvider client={queryClient}>
            <ColorSchemeProvider
              colorScheme={colorScheme}
              toggleColorScheme={toggleColorScheme}
            >
              <MantineProvider
                theme={{ colorScheme }}
                withGlobalStyles
                withNormalizeCSS
              >
                <Toaster />
                <Component {...pageProps} />
              </MantineProvider>
            </ColorSchemeProvider>
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
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "dark",
  };
};
