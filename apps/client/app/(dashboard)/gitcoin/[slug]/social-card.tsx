import { IconCalendarMonth, IconWorldWww, IconBrandTwitter } from '@tabler/icons-react';
import Link from 'next/link';
import { Divider, Text } from '@mantine/core';

interface SocialCardProps {
    createdOn: string;
    website: string;
    twitter: string;
    }

export default function SocialCard( {createdOn, website, twitter}: SocialCardProps) {
  return (
    <div className="space-y-5 w-full">
      <Divider />
      <div className="space-y-3">
        <div className="flex items-center ">
          <IconCalendarMonth />
          <Text size="sm">Created on: {createdOn}</Text>
        </div>
        <div className="flex items-center">
          <IconWorldWww />
          <Link href="" className="text-blue-400 underline">
            {website}
          </Link>
        </div>
        <div className="flex items-center">
          <IconBrandTwitter />
          <Link href="" className="text-blue-400 underline">
           {twitter}
          </Link>
        </div>
      </div>
      <Divider />
    </div>
  );

}
