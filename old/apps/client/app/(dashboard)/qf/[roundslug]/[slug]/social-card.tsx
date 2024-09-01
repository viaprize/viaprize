import { Divider, Text } from '@mantine/core';
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { IconBrandTwitter, IconCalendarMonth, IconWorldWww } from '@tabler/icons-react';
import Link from 'next/link';

interface SocialCardProps {
  createdOn: number;
  website: string;
  twitter: string;
}

function formatDate(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US');
}

export default function SocialCard({ createdOn, website, twitter }: SocialCardProps) {
  return (
    <div className="space-y-5 w-full">
      <Divider />
      <div className="space-y-3">
        <div className="flex items-center space-x-2 ">
          <IconCalendarMonth />
          <Text size="sm">Created on: {formatDate(createdOn)}</Text>
        </div>
        <div className="flex items-center space-x-2">
          <IconWorldWww />
          <Link href="" className="text-blue-400 underline">
            {website}
          </Link>
        </div>
        {twitter ? (
          <div className="flex items-center space-x-2">
            <IconBrandTwitter />
            <Link href="" className="text-blue-400 underline">
              {twitter}
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <IconBrandTwitter />
            <Text size="sm">No Twitter account available</Text>
          </div>
        )}
      </div>
      <Divider />
    </div>
  );
}
