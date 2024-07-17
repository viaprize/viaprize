import { Avatar, Badge, Button, Card, Group, Text } from '@mantine/core';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { FaSackDollar, FaUser, FaUsers } from 'react-icons/fa6';

interface PrizeFunderCardProps {
  name: string;
  email?: string;
  budget?: number;
  walletAddress?: string;
  avatar?: string;
  username: string;
  badge: string | number;
  date?: string;
}

export default function PrizeFunderCard({
  name,
  avatar,
  username,
  badge,
  date,
}: PrizeFunderCardProps) {
  return (
    <Card
      shadow="xs"
      padding="lg"
      my="md"
      radius="md"
      withBorder
      className="flex flex-row justify-between items-center gap-4"
    >
      <div className="flex items-center gap-2">
        <Avatar radius="md" alt="creator" className="rounded-sm" src={avatar} />
        <div>
          <Link href={`/profile/${username}`}>
            <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
              {name}
            </Text>
          </Link>
        </div>
      </div>
      <Group gap="sm">
        <Badge
          size="lg"
          radius="md"
          variant="light"
          color={typeof badge === 'string' ? 'yellow' : 'green'}
          leftSection={typeof badge === 'string' ? <FaUser /> : <FaSackDollar />}
        >
          {typeof badge === 'string' ? badge : `$${badge}`}
        </Badge>
        {date ? (
          <Badge size="lg" radius="md" variant="light" color="blue">
            {formatDistanceToNow(new Date(parseInt(date) * 1000), {
              addSuffix: true,
            })}
          </Badge>
        ) : null}
      </Group>
    </Card>
  );
}
