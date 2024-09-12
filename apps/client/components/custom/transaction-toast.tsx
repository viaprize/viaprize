import { Button, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link';

export function TransactionToast({
  title,
  hash,
  scanner = `https://optimistic.etherscan.io/tx/`,
}: {
  title: string;
  hash: string;
  scanner?: string;
}) {
  return (
    <div className="flex items-center  ">
      <IconCircleCheck />
      <Text fw="md" size="sm" className="ml-2">
        {title}
      </Text>
      <Link target="_blank" rel="noopener noreferrer" href={`${scanner}${hash}`}>
        <Button variant="transparent" className="text-blue-400 underline">
          See here
        </Button>
      </Link>
    </div>
  );
}
