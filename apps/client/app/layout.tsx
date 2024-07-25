import type { Metadata } from 'next';
import Script from 'next/script';
import WrapperLayout from './wrapper';

export const metadata: Metadata = {
  title: 'viaPrize',
  description: 'Trustworthy crowdfunding and prizes',
  twitter: {
    card: 'summary_large_image',
    title: 'viaPrize',
    description: 'Trustworthy crowdfunding and prizes',
    images: [
      {
        url: 'https://viaprize.org/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'viaPrize',
      },
    ],
  },
  metadataBase: new URL('https://viaprize.org/'),
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
