import type { Metadata } from 'next';
import WrapperLayout from './wrapper';

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
      <body>
        <WrapperLayout>{children}</WrapperLayout>
      </body>
    </html>
  );
}
