import "../styles/globals.css";
import "../styles/index.css";
import { Web3ContextProvider } from "@/context/Web3Context";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Pact</title>
      </Head>

      <Web3ContextProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </Web3ContextProvider>
    </>
  );
}

export default MyApp;