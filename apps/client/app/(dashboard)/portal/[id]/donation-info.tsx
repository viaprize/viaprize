import { Table } from '@mantine/core';
import React from 'react';
import ReceiverAddressCard from './reciever-address-card';

interface Donation {
  donatedAt: string;
  donor: string;
  network: string;
  amount: number;
  usdValue: number;
}

const donationData: Donation[] = [
  {
    donatedAt: '27th july',
    donor: '0x1234567890',
    network: 'ETH',
    amount: 0.1,
    usdValue: 100,
  },
  {
    donatedAt: '27th july',
    donor: '0x1234567890',
    network: 'ETH',
    amount: 0.1,
    usdValue: 100,
  },
  {
    donatedAt: '27th july',
    donor: '0x1234567890',
    network: 'ETH',
    amount: 0.1,
    usdValue: 100,
  },
  {
    donatedAt: '27th july',
    donor: '0x1234567890',
    network: 'ETH',
    amount: 0.1,
    usdValue: 100,
  },
  // Add more donation objects as needed
];

export default function DonationInfo() {
  return (
    <div className="w-full lg:flex  gap-4 px-3 sm:px-6 md:px-14 lg:px-20 justify-between mt-5 ">
      <Table highlightOnHover horizontalSpacing="sm" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Donated at</Table.Th>
            <Table.Th>Donor</Table.Th>
            <Table.Th>Network</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>USD Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {donationData.map((donation, index) => (
            <Table.Tr key={index}>
              <Table.Td>{donation.donatedAt}</Table.Td>
              <Table.Td>{donation.donor}</Table.Td>
              <Table.Td>{donation.network}</Table.Td>
              <Table.Td>{donation.amount}</Table.Td>
              <Table.Td>{donation.usdValue}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
