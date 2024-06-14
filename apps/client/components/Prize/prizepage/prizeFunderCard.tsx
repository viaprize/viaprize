import { Avatar, Card, Text } from '@mantine/core';
import Link from 'next/link';

interface PrizeFunderCardProps {
  name: string;
  email?: string;
  budget?: number;
  walletAddress?: string;
  avatar: string;
  username: string;
}

export default function PrizeFunderCard({
  name,
  avatar,
  username,
}: PrizeFunderCardProps) {
  return (
    <Card
      shadow="xs"
      padding="lg"
      my="md"
      radius="md"
      withBorder
      className="flex flex-row justify-start items-center gap-4"
    >
      <Avatar radius="md" alt="creator" className="rounded-sm" src={avatar} />
      <div>
        <Link href={`/profile/${username}`}>
          <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
            {name}
          </Text>
        </Link>
      </div>
    </Card>
  );
}
