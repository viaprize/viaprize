import type { CenterProps } from '@mantine/core';
import { Center } from '@mantine/core';
import type { ReactNode } from 'react';
import { cn } from 'utils/tailwindmerge';

interface ShellProps extends CenterProps {
  children: ReactNode;
}

export default function Shell({ children, ...props }: ShellProps) {
  return (
    <Center {...props} w="100%" className={cn('flex flex-col h-56', props.className)}>
      {children}
    </Center>
  );
}
