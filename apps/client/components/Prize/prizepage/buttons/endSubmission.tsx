import { backendApi } from '@/lib/backend';
import { Button, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

export default function EndSubmission({ contractAddress }: { contractAddress: string }) {
  const { mutateAsync, isLoading } = useMutation(
    async () => {
      return await (await backendApi()).wallet.prizeEndSubmissionCreate(contractAddress);
    },
    {
      onSuccess: async (data) => {
        toast.success(
          <div className="flex items-center ">
            <IconCircleCheck />{' '}
            <Text fw="md" size="sm" className="ml-2">
              {' '}
              Submission Ended
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
      fullWidth
      my="md"
      loading={isLoading}
      onClick={async () => {
        const result = await mutateAsync?.();
        console.log(result);
      }}
    >
      {' '}
      End Submission
    </Button>
  );
}
