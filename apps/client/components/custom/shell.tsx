import { Center } from '@mantine/core';
import type { ReactNode } from 'react';

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <Center maw={400} h={100}>
      {children}
    </Center>
  );
}
