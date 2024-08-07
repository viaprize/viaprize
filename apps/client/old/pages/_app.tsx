// import { OwnLoader } from '@/components/custom/loader';
// import NavigationProvider from '@/components/layout/navigation-progress';
// import { configureChainsConfig } from '@/lib/wagmi';
// import { env } from '@env';
// import { MantineProvider } from '@mantine/core';
// import '@mantine/core/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/tiptap/styles.css';
// import { PrivyProvider } from '@privy-io/react-auth';
// import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
// import { SpeedInsights } from '@vercel/speed-insights/next';
// import type { NextPage } from 'next';
// import type { AppContext, AppProps } from 'next/app';
// import NextApp from 'next/app';
// import Head from 'next/head';
// import { Router } from 'next/router';
// import Script from 'next/script';
// import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
// import { QueryClient, QueryClientProvider } from 'react-query';
// import { Toaster } from 'sonner';
// import { theme } from 'utils/theme';
// import '../styles/globals.css';
// import '../styles/index.css';

// const queryClient = new QueryClient();

// // Default values shown

// // eslint-disable-next-line @typescript-eslint/ban-types -- required for Next.js
// export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
//   getLayout?: (page: ReactElement) => ReactNode;
// };

// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout;
// };

// export default function App({ Component, pageProps }: AppPropsWithLayout) {
//   // console.log(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
//   const getLayout = Component.getLayout ?? ((page) => page);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const start = () => {
//       setLoading(true);
//     };
//     const end = () => {
//       setLoading(false);
//     };

//     Router.events.on('routeChangeStart', start);
//     Router.events.on('routeChangeComplete', end);
//     Router.events.on('routeChangeError', end);

//     return () => {
//       Router.events.off('routeChangeStart', start);
//       Router.events.off('routeChangeComplete', end);
//       Router.events.off('routeChangeError', end);
//     };
//   }, []);

//   return (
//     <>
//       <Head>
//         <title>viaPrize</title>
//         <meta
//           name="viewport"
//           content="minimum-scale=1, initial-scale=1, width=device-width"
//         />
//         <script
//           type="module"
//           defer
//           src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/hourglass.js"
//         />
//         <link rel="shortcut icon" href="/favicon.ico" />
//       </Head>
//       <head>
//         <Script
//           defer
//           data-domain="viaprize.org"
//           src="https://plausible.io/js/script.js"
//         />
//         <Script async src="https://www.googletagmanager.com/gtag/js?id=G-HF9F0C1910" />
//         <Script id="google-analytics">
//           {`  window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());
//   gtag('config', 'G-HF9F0C1910');`}
//         </Script>
//       </head>
//       <SpeedInsights />
//       <PrivyProvider
//         appId={env.NEXT_PUBLIC_PRIVY_APP_ID || ' '}
//         config={{
//           loginMethods: ['email', 'wallet'],
//           additionalChains: [],
//           defaultChain: configureChainsConfig.chains[0],
//           appearance: {
//             theme: 'dark',
//             accentColor: '#676FFF',
//             logo: 'https://www.viaprize.org/_next/image?url=%2FviaprizeBg.png&w=64&q=75',
//           },
//         }}
//       >
//         <Toaster richColors />
//         <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
//           <QueryClientProvider client={queryClient}>
//             <MantineProvider theme={theme} defaultColorScheme="auto">
//               <NavigationProvider>
//                 {getLayout(
//                   loading ? (
//                     <OwnLoader />
//                   ) : (
//                     <Component {...pageProps} suppressHydrationWarning />
//                   ),
//                 )}
//               </NavigationProvider>
//             </MantineProvider>
//           </QueryClientProvider>
//         </PrivyWagmiConnector>
//       </PrivyProvider>
//     </>
//   );
// }

// App.getInitialProps = async (appContext: AppContext) => {
//   const appProps = await NextApp.getInitialProps(appContext);
//   return {
//     ...appProps,
//   };
// };
