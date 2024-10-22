'use client';

import NavigationProvider from '@/components/layout/navigation-progress';
import { configureChainsConfig } from '@/lib/wagmi';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/tiptap/styles.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import { theme } from 'utils/theme';
import '../styles/globals.css';
import '../styles/index.css';

export const queryClient = new QueryClient();

export default function WrapperLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(configureChainsConfig.chains[0], 'chains');
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <ModalsProvider>
            <Toaster richColors />
            <NavigationProvider>{children}</NavigationProvider>
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </div>
  );
}
