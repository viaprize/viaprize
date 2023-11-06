import { PrizeProposals } from '@/lib/api';
import { useViaPrizeFactoryCreateViaPrize } from '@/lib/smartContract';
import { ProposalStatus } from '@/lib/types';
import { Text } from '@mantine/core';
import { waitForTransaction } from '@wagmi/core';
import { useRef } from 'react';
import { useAccount } from 'wagmi';
import ProposalExploreCard from '../ExplorePrize/proposalExploreCard';
import { usePrize } from '../hooks/usePrize';
export default function ProposalsTabs({
  data,
  isSuccess,
}: {
  data?: PrizeProposals[];
  isSuccess: boolean;
}) {
  console.log(data, 'data');
  const { address } = useAccount();
  const currentTimestamp = useRef(Date.now());
  const { createPrize } = usePrize();

  const {
    data: prizeContract,

    writeAsync,
  } = useViaPrizeFactoryCreateViaPrize({
    account: address,
  });

  console.log(prizeContract, 'prizeContract');

  const getProposalStatus = (item: PrizeProposals): ProposalStatus => {
    if (data) {
      if (item.isApproved) {
        return 'approved';
      } else if (item.isRejected) {
        return `rejected`;
      }
      return 'pending';
    }
    return 'pending';
  };
  return (
    <div className="p-6 w-full">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {isSuccess ? (
          data?.map((item) => (
            <ProposalExploreCard
              status={getProposalStatus(item)}
              key={item.id}
              imageUrl={item.images[0]}
              description={item.description}
              onStatusClick={async (status) => {
                switch (status) {
                  case 'pending': {
                    console.log('pending');
                    break;
                  }
                  case 'approved': {
                    console.log('approved');
                    console.log(
                      [
                        item?.admins as `0x${string}`[],
                        [
                          '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
                          '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
                        ] as `0x${string}`[],
                        BigInt(10),
                        BigInt(10),
                        '0x62e9a8374AE3cdDD0DA7019721CcB091Fed927aE' as `0x${string}`,
                      ],
                      'args',
                    );

                    const out = await writeAsync({
                      args: [
                        item?.admins as `0x${string}`[],
                        [
                          '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
                          '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
                        ] as `0x${string}`[],
                        BigInt(10),
                        BigInt(10),
                        '0x62e9a8374AE3cdDD0DA7019721CcB091Fed927aE' as `0x${string}`,
                        BigInt(currentTimestamp.current),
                      ],
                    });
                    console.log(out, 'out');
                    const waitForTransactionOut = await waitForTransaction({
                      hash: out.hash,
                      confirmations: 1,
                    });
                    console.log(waitForTransactionOut.logs[0].topics[2]);
                    const prizeAddress =
                      '0x' + waitForTransactionOut.logs[0].topics[2]?.slice(-40);
                    console.log(prizeAddress, 'prizeAddress');
                    const prize = await createPrize({
                      address: prizeAddress,
                      proposal_id: item.id,
                    });
                    console.log(prize, 'prize');
                    alert('done');
                    break;
                  }
                  case 'rejected': {
                    console.log('rejected');

                    break;
                  }
                  default:
                    break;
                }
              }}
              title={item.title}
            />
          ))
        ) : (
          <Text>No Proposals</Text>
        )}
      </div>
    </div>
  );
}
