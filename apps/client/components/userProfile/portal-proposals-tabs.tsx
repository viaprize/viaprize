import { PortalProposals } from '@/lib/api';
import { prepareWritePortalFactory, writePortalFactory } from '@/lib/smartContract';
import { ProposalStatus } from '@/lib/types';
import { Text } from '@mantine/core';
import { waitForTransaction } from '@wagmi/core';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import ProposalExploreCard from '../ExplorePrize/proposalExploreCard';
import { usePortal } from '../hooks/usePortal';
const getProposalStatus = (item: PortalProposals): ProposalStatus => {
  if (item.isApproved) {
    return 'approved';
  } else if (item.isRejected) {
    return `rejected`;
  }
  return 'pending';

  return 'pending';
};
export default function PortalProposalsTabs({
  data,
  isSuccess,
}: {
  data?: PortalProposals[];
  isSuccess: boolean;
}) {
  console.log({ isSuccess });
  console.log({ data }, 'datatatatata');
  const router = useRouter();
  const { createPortal } = usePortal();
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
                console.log({ status }, 'status');
                switch (status) {
                  case 'pending': {
                    console.log('pending');
                    break;
                  }
                  case 'approved': {
                    const firstLoadingToast = toast.loading(
                      'Trasnaction Waiting To Be approved',
                      {
                        delete: false,
                        dismissible: false,
                      },
                    );

                    console.log('approved');
                    // console.log(
                    //     [
                    //         item?.admins as `0x${string}`[],
                    //         [
                    //             '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
                    //             '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
                    //             '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
                    //         ] as `0x${string}`[],
                    //         BigInt(10),
                    //         BigInt(10),
                    //         '0x62e9a8374AE3cdDD0DA7019721CcB091Fed927aE' as `0x${string}`,
                    //     ],
                    //     'args',
                    // );
                    console.log(item, 'item');
                    const finalFundingGoal = parseEther(
                      (item.fundingGoal ?? '0').toString(),
                    );
                    const request = await prepareWritePortalFactory({
                      functionName: 'createPortal',
                      args: [
              
                        item?.treasurers as `0x${string}`[],
                        finalFundingGoal,
                        BigInt(Math.floor(new Date(item.deadline).getTime() / 1000) ?? 0),
                        item.allowDonationAboveThreshold,
                        BigInt(5),
                        item.sendImmediately,
                      ],
                    });
                    const transaction = await writePortalFactory(request);
                    // const out = await writeViaPrizeFactory(request);
                    toast.dismiss(firstLoadingToast);
                    const secondToast = toast.loading(
                      'Waiting for transaction Confirmation...',
                      {
                        dismissible: false,
                        delete: false,
                      },
                    );
                    console.log(transaction, 'out');
                    const waitForTransactionOut = await waitForTransaction({
                      hash: transaction.hash,
                      confirmations: 1,
                    });
                    console.log(waitForTransactionOut.logs[0].topics[1]);
                    const portalAddress =
                      '0x' + waitForTransactionOut.logs[0].topics[1]?.slice(-40);
                    console.log(portalAddress, 'portalAddress');
                    const portal = await createPortal({
                      address: portalAddress,
                      proposal_id: item.id,
                    });
                    toast.dismiss(secondToast);
                    console.log(portal, 'portal');
                    toast.success(`portal Address ${portalAddress} `);
                    toast.promise(router.push('/portal/explore'), {
                      loading: 'Redirecting Please Wait',
                      error: 'Error while redirecting ',
                      success: 'Redirected to portal Explore Page',
                    });
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
