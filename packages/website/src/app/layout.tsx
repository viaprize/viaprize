import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@viaprize/ui/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import getConfig from "next/config";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "viaPrize",
  description: "viaPrize",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie")
  );
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
