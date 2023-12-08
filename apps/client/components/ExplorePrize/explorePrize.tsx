import { chain } from '@/lib/wagmi';
import { Badge, Button, Card, Group, Image, Text } from '@mantine/core';

interface ExploreCardProps {
  imageUrl: string;
  title: string;
  profileName: string;
  description: string;
  money: string;
  deadline: string;
  id: string;
}

function htmlToPlainText(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function ExploreCard({
  imageUrl,
  profileName,
  title,
  description,
  money,
  deadline,
  id,
}: ExploreCardProps) {
  return (
    <Card padding="lg" radius="md" shadow="sm" withBorder className="w-full my-4">
      <Card.Section>
        <Image
          alt="Image"
          height={160}
          src={
            imageUrl ||
            'https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image'
          }
        />
      </Card.Section>
      <Group mb="xs" mt="md" justify="space-between">
        <Text fw={500}>{title}</Text>
        <Badge color="gray" variant="light">
          {profileName}
        </Badge>
      </Group>
      <p
        className="text-md text-gray-500 h-20 overflow-y-auto"
        // dangerouslySetInnerHTML={{ __html: description }}
      >
        {htmlToPlainText(description)}
      </p>
      {/*  >{htmlToPlainText(description)}</p> */}
      <Group mb="xs" mt="sm" justify="space-between">
        <Text c="green" fw={500}>
          {money} {chain.nativeCurrency.symbol}
        </Text>
        <Text c="red" fw={500}>
          {deadline}
        </Text>
      </Group>
      <Button
        color="blue"
        component="a"
        fullWidth
        mt="md"
        radius="md"
        variant="light"
        href={`/prize/${id}`}
      >
        Details
      </Button>
    </Card>
  );
}

export default ExploreCard;
