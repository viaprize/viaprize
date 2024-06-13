import { backendApi } from '@/lib/backend';

import { Button, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

export default function EndVoting({ contractAddress }: { contractAddress: string }) {
  const { mutateAsync, isLoading } = useMutation(
    async () => {
      return await (await backendApi()).wallet.prizeEndVotingCreate(contractAddress);
    },
    {
      onSuccess: async (data) => {
        toast.success(
          <div className="flex items-center ">
            <IconCircleCheck />{' '}
            <Text fw="md" size="sm" className="ml-2">
              {' '}
              Voting Period Ended
            </Text>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://optimistic.etherscan.io/tx/${data.data.hash}`}
            >
              <Button variant="transparent" className="text-blue-400 underline">
                See here
              </Button>
            </Link>
          </div>,
        );
        window.location.reload();
      },
    },
  );
  return (
    <Button
      my="md"
      fullWidth
      loading={isLoading}
      onClick={async () => {
        const result = await mutateAsync?.();
      }}
    >
      {' '}
      End Voting
    </Button>
  );
}
