import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  ScrollArea,
} from "@mantine/core";
import { useState } from "react";

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
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={imageUrl} height={160} alt="Image" />
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
        <Badge color="gray" variant="light">
          {profileName}
        </Badge>
      </Group>
      <p className="text-md text-gray-500 max-h-14 overflow-y-auto">
        {description}
      </p>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500} color="green">
          {money}
        </Text>
        <Text weight={500} color="red">
          {deadline}
        </Text>
      </Group>
      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Details
      </Button>
    </Card>
  );
};

export default ExploreCard;
