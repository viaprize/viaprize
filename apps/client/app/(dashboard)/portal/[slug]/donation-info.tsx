import getCryptoToUsd from '@/components/hooks/server-actions/CryptotoUsd';
import type { Contributions } from '@/lib/api';
import { backendApi } from '@/lib/backend';
import { EXTRA_FUNDRAISERS_IDS } from '@/lib/constants';
import { Table } from '@mantine/core';
import { useQuery } from 'react-query';
import { formatEther } from 'viem';

// const donationData: Donation[] = [
//   {
//     donatedAt: '27th july',
//     donor: '0x1234567890',
//     network: 'ETH',
//     amount: 0.1,
//     usdValue: 100,
//   },
//   {
//     donatedAt: '27th july',
//     donor: '0x1234567890',
//     network: 'ETH',
//     amount: 0.1,
//     usdValue: 100,
//   },
//   {
//     donatedAt: '27th july',
//     donor: '0x1234567890',
//     network: 'ETH',
//     amount: 0.1,
//     usdValue: 100,
//   },
//   {
//     donatedAt: '27th july',
//     donor: '0x1234567890',
//     network: 'ETH',
//     amount: 0.1,
//     usdValue: 100,
//   },
//   // Add more donation objects as needed
// ];

export default function DonationInfo({
  contributors,
  id,
}: {
  contributors?: Contributions;
  id: string;
}) {
  const { data: ethToUsd } = useQuery(['cryptoToUsd', undefined], async () =>
    getCryptoToUsd(),
  );

  console.log(contributors, 'contributors');

  const { data: extraData, isSuccess } = useQuery(
    ['get-extra-data-donation'],
    async () => {
      if (EXTRA_FUNDRAISERS_IDS.includes(id)) {
        console.log('sjkljfld');
        return (await backendApi(false)).portals.extraDonationDataDetail(id);
      }
    },
  );
  console.log({ extraData });
  return (
    <div className="lg:flex  gap-4 px-3 sm:px-6 md:px-14 lg:px-20 justify-between mt-5 w-full max-w-[90vw]">
      {(contributors?.data && contributors.data.length > 0) || isSuccess ? (
        <div className="overflow-x-auto w-full">
          <Table
            highlightOnHover
            horizontalSpacing="sm"
            verticalSpacing="sm"
            className="w-full"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Donated at</Table.Th>
                <Table.Th>Donor</Table.Th>
                {/* <Table.Th>Network</Table.Th> */}
                <Table.Th>USD</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {contributors?.data.map((donation) => {
                console.log(formatEther(BigInt(donation.amount)), 'dontai');
                return (
                  <Table.Tr key={donation.donationTime}>
                    <Table.Td>
                      {new Date(parseInt(donation.donationTime) * 1000).toDateString()}
                    </Table.Td>
                    <Table.Td>{donation.contributor}</Table.Td>
                    {/* <Table.Td>{donation.network}</Table.Td> */}
                    <Table.Td>{parseFloat(donation.amount) / 1_000_000}</Table.Td>
                  </Table.Tr>
                );
              })}

              {extraData &&
                extraData?.data.length > 0 &&
                extraData?.data.map((donation) => {
                  return (
                    <Table.Tr key={donation.id}>
                      <Table.Td>{new Date(donation.donatedAt).toDateString()}</Table.Td>
                      <Table.Td>{donation.donor}</Table.Td>
                      {/* <Table.Td>{donation.network}</Table.Td> */}
                      <Table.Td>{donation.usdValue}</Table.Td>
                    </Table.Tr>
                  );
                })}
            </Table.Tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center">No donations yet</div>
      )}
    </div>
  );
}
