import { prepareWritePrize, writePrize } from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { waitForTransaction } from '@wagmi/core';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

export default function EarlyRefund({ contractAddress }: { contractAddress: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  return (
    <Button
      my="md"
      fullWidth
      loading={isLoading}
      color="red"
      onClick={async () => {
        setIsLoading(true);
        try {
          const request = await prepareWritePrize({
            address: contractAddress as `0x${string}`,
            account: address,
            functionName: 'earlyRefund',
          });
          const { hash } = await writePrize(request);

          const waitTransaction = await waitForTransaction({
            confirmations: 1,
            hash,
          });
          toast.success(
            `Submission Period Started, Transaction Hash  ${hash.slice(0, 2)}...${hash.slice(-2)}`,
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
      Early Refund
    </Button>
  );
}
