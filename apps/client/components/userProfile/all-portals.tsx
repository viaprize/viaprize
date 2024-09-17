import { backendApi } from '@/lib/backend';
import type { ConvertUSD } from '@/lib/types';
import { Button, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import Shell from '../custom/shell';
import SkeletonLoad from '../custom/skeleton-load-explore';
import useAuthPerson from '../hooks/useAuthPerson';

export default function AllPortals({ params }: { params: { id: string } }) {
  const { isLoading, data } = useQuery(['getPortalsOfUser', undefined], async () => {
    return (await backendApi()).portals.userDetail(params.id);
  });
  const isProfileOwner = useAuthPerson();

  const { data: cryptoToUsd } = useQuery<ConvertUSD>(['get-crypto-to-usd'], async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const final = await (
      await fetch(`https://prod-api.viaprize.org/api/price/usd_to_eth`)
    ).json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.keys(final).length === 0
      ? {
          ethereum: {
            usd: 0,
          },
        }
      : final;
  });

  const router = useRouter();

  if (isLoading) return <SkeletonLoad numberOfCards={3} gridedSkeleton />;

  if (!data || data.data.length === 0)
    return (
      <Shell>
        <Text>No Fundraisers</Text>
        {isProfileOwner ? (
          <Button
            onClick={() => {
              router.push('/portal/create');
            }}
            className="mt-4"
          >
            Create Fundraisers
          </Button>
        ) : null}
      </Shell>
    );
  return <div className="grid md:grid-cols-2 grid-cols-1 gap-3">jkl</div>;
}
