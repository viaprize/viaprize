import { prepareWritePrize, writePrize } from '@/lib/smartContract';
import { Button,Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { waitForTransaction } from '@wagmi/core';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

export default function StartSubmission({
  contractAddress,
  submissionTime,
}: {
  contractAddress: string;
  submissionTime: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  console.log({ submissionTime }, 'submission time ');
  const { address } = useAccount();

  return (
    <Button
      my="md"
      fullWidth
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const request = await prepareWritePrize({
            address: contractAddress as `0x${string}`,
            account: address,
            functionName: 'start_submission_period',
            args: [BigInt(submissionTime)],
          });
          const { hash } = await writePrize(request);

          const waitTransaction = await waitForTransaction({
            confirmations: 1,
            hash,
          });
          toast.success(
            <div className="flex items-center ">
              <IconCircleCheck />{' '}
              <Text fw="md" size="sm" className="ml-2">
                {' '}
                Submission Period Started
              </Text>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://optimistic.etherscan.io/tx/${hash}`}
              >
                <Button variant="transparent" className="text-blue-400 underline">
                  See here
                </Button>
              </Link>
            </div>
          );
          console.log({ hash }, 'hash');
        } catch (error) {
          toast.error(`Failed With Error`);
        } finally {
          setIsLoading(false);
          window.location.reload();
        }
      }}
    >
      {' '}
      Start Submission
    </Button>
  );
}
