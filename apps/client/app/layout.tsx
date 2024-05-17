import type { Metadata } from 'next';
import WrapperLayout from './wrapper';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'viaPrize',
  description:
    'viaPrize is a platform for creating and funding prizes for the Ethereum community.',
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          defer
          data-domain="viaprize.org"
          src="https://plausible.io/js/script.js"
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-HF9F0C1910" />
        <Script id="google-analytics">
          {`  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-HF9F0C1910');`}
        </Script>
      </head>
      <body>
        <WrapperLayout>{children}</WrapperLayout>
      </body>
    </html>
  );
}
