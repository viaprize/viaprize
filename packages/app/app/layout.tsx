import "../styles/globals.css";
import "../styles/index.css";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import 'antd/dist/reset.css'
import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { Web3ContextProvider } from "@/context/Web3Context";
import { ToastContainer } from "react-toastify";
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
            {children}

          </MantineProvider>
          <ToastContainer />
        </Web3ContextProvider>
      </body>
    </html>
  );
}
