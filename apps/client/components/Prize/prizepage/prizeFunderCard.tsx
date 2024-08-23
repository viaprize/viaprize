import { formatDateString } from '@/lib/utils';
import { Avatar, Badge, Card, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { FaSackDollar, FaUser } from 'react-icons/fa6';

interface PrizeFunderCardProps {
  name: string;
  email?: string;
  budget?: number;
  walletAddress?: string;
  avatar?: string;
  username: string;
  badge?: string | number;
  date?: string;
  amountIn: string;
}

export default function PrizeFunderCard({
  name,
  avatar,
  username,
  badge,
  date,
  amountIn = 'USD',
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
            <Text variant="p" fw="lighter" my="0px" className="leading-[15px]">
              {name}
            </Text>
          </Link>
        </div>
      </div>
      <Group gap="sm">
        {badge ? (
          <Badge
            size="lg"
            radius="md"
            variant="light"
            color={typeof badge === 'string' ? 'yellow' : 'green'}
            leftSection={typeof badge === 'string' ? <FaUser /> : <FaSackDollar />}
          >
            {typeof badge === 'string' ? badge : `${badge} in ${amountIn}`}
          </Badge>
        ) : null}
        {date ? (
          <Badge size="lg" radius="md" variant="light" color="blue">
            {formatDateString(new Date(parseInt(date) * 1000))}
          </Badge>
        ) : null}
      </Group>
    </Card>
  );
}
