'use client';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CopyButton,
  Group,
  Image,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { FaSackDollar, FaUsers } from 'react-icons/fa6';
import { GiSandsOfTime } from 'react-icons/gi';
import { PiTimerFill } from 'react-icons/pi';

interface HistoryCardProps {
  id: number;
  status: string;
  datePosted: string;
  title: string;
  description: string;
  awarded: string;
  imageUrl: string;
  category: string;
  contestants: number;
}

export default function HistoryCard({
  status,
  datePosted,
  title,
  description,
  awarded,
  imageUrl,
  id,
  category,
  contestants,
}: HistoryCardProps) {
  const statusColor = status.toLowerCase() === 'won' ? 'green' : 'yellow';

  return (
    <Card
      component="a"
      padding="lg"
      radius="md"
      withBorder
      className="shadow hover:shadow-lg transition-all duration-300 ease-in-out "
      pos="relative"
      href={`/prize/old/${id}`}
    >
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
      <Group mt="xs" justify="space-between ">
        <div className="flex items-center space-x-2">
          <PiTimerFill color="red" />
          <div className="text-red-600 font-bold">Time is up!</div>
        </div>
        {/* {datePosted?.length > 0 ? (
          <Badge color="blue" variant="light" p="sm">
            Date Posted : {datePosted}
          </Badge>
        ) : (
          <Text>No date posted</Text>
        )} */}
        <Badge color={statusColor}>{status}</Badge>
      </Group>
      <Text size="xl" mt="sm" fw={600}>
        {title}
      </Text>
      <div className="grid grid-cols-2 gap-2 my-2">
        <Tooltip label="Funds Allocated" withArrow>
          <Button
            variant="light"
            color="yellow"
            fullWidth
            className="text-md font-bold cursor-pointer"
            leftSection={<FaSackDollar />}
          >
            {awarded}
          </Button>
        </Tooltip>
        <Tooltip label="Date Posted" withArrow>
          <Button
            variant="light"
            color="red"
            fullWidth
            className="text-md font-bold cursor-pointer"
            // leftSection={<GiSandsOfTime />}
          >
            {datePosted?.length > 0 ? datePosted : <Text>No date posted</Text>}
          </Button>
        </Tooltip>
        <Tooltip label="Category" withArrow>
          <Button
            variant="light"
            color="blue"
            fullWidth
            className="text-md font-bold cursor-pointer"
          >
            {category}
          </Button>
        </Tooltip>
        <Tooltip label="Contestants" withArrow>
          <Button
            variant="light"
            color="green"
            fullWidth
            className="text-md font-bold pointer-events-none"
            leftSection={<FaUsers />}
          >
            {contestants} Contestants
          </Button>
        </Tooltip>
      </div>
      {/* <p className="text-md max-h-16  overflow-y-auto">{description}</p> */}
      {/* <Group justify="space-between">
        <Text fw={500}>
          AWARDED : <span className="font-extrabold">{awarded}</span>
        </Text>
        <Badge
          color="gray"
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
          radius="sm"
        >
          {category}
        </Badge>
        <Badge color="blue" variant="light" p="sm" radius="md">
          {contestants} Contestants
        </Badge>
      </Group> */}
      {/* <Button
        color="primary"
        component="a"
        fullWidth
        mt="md"
        radius="md"
        href={`/prize/old/${id}`}
      >
        Details
      </Button> */}
      <div className="absolute top-2 right-2">
        <CopyButton value={`https://viaprize.org/prize/old/${id}`}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Share URL'} withArrow>
              <ActionIcon size="lg" onClick={copy} color={copied ? 'teal' : 'primary'}>
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
    </Card>
  );
}
