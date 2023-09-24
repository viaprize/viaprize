import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";

interface ExploreCardProps {
  imageUrl: string;
  title: string;
  profileName: string;
  description: string;
  money: string;
  deadline: string;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
  imageUrl,
  profileName,
  title,
  description,
  money,
  deadline,
}) => {
  return (
    <Card padding="lg" radius="md" shadow="sm" withBorder>
      <Card.Section>
        <Image alt="Image" height={160} src={imageUrl} />
      </Card.Section>
      <Group mb="xs" mt="md" position="apart">
        <Text weight={500}>{title}</Text>
        <Badge color="gray" variant="light">
          {profileName}
        </Badge>
      </Group>
      <p className="text-md text-gray-500 max-h-14 overflow-y-auto">
        {description}
      </p>
      <Group mb="xs" mt="md" position="apart">
        <Text color="green" weight={500}>
          {money}
        </Text>
        <Text color="red" weight={500}>
          {deadline}
        </Text>
      </Group>
      <Button color="blue" fullWidth mt="md" radius="md" variant="light">
        Details
      </Button>
    </Card>
  );
};

export default ExploreCard;
