import "../styles/globals.css";
import "../styles/index.css";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { Web3ContextProvider } from "@/context/Web3Context";
import { ToastContainer } from "react-toastify";
import Providers from "../components/_providers/providers";

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body>
        <Web3ContextProvider>
          <MantineProvider>
            <Providers>
              {children}
            </Providers>
          </MantineProvider>
          <ToastContainer />
        </Web3ContextProvider>
      </body>
    </html>
  );
}
