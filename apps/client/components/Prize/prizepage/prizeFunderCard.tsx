import { Avatar, Card, Text } from '@mantine/core';

interface PrizeFunderCardProps {
  name: string;
  email?: string;
  budget?: number;
  walletAddress?: string;
  avatar: string;
}

export default function PrizeFunderCard({ name, avatar }: PrizeFunderCardProps) {
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
        <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
          {name}
        </Text>
        {/* <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
            Proposer Email: {email}
          </Text> */}
      </div>
    </Card>
  );
}
