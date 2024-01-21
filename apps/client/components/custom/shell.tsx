import { Center } from '@mantine/core';
import type { ReactNode } from 'react';

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <Center w="100%" h={100} className='flex flex-col'>
      {children}
    </Center>
  );
}
