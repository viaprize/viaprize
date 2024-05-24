'use client';
import {
  Card,
  Group,
  Badge,
  Button,
  CopyButton,
  Tooltip,
  ActionIcon,
  Text,
  Image,
  Divider
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

import Link from 'next/link';


interface GitcoinCardProps {
  imageURL: string;
  title: string;
  by: string;
  description: string;
  raised: number;
  contributors: number;
  link: string;
}
export default function GitcoinCard({ imageURL,by, title, description, raised, contributors, link }: GitcoinCardProps) {
  return (
    <Card
      padding="lg"
      radius="lg"
      withBorder
      className="shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
      pos="relative"
    >
      <Card.Section>
        <Image
          alt="Image"
          height={160}
          src={
           imageURL
          }
        />
      </Card.Section>

      <Group mt="sm" justify="space-between">
        <Text fw="bold" size="lg">
          {title}
        </Text>
        <Badge color="blue" variant="light" p="sm">
       {by}
        </Badge>
      </Group>

      <p
        className="text-md  h-20 overflow-y-auto"
        // dangerouslySetInnerHTML={{ __html: description }}
      >
        {description}
      </p>
  <Divider  className='mt-2'/>
      <Text fw="bold" size="xl">
        ${raised}
      </Text>
      <Text size="sm">
        Total raised by <span className="text-gray font-bold">{contributors}</span>
        contributers
      </Text>

      <Link href="https://viaprize.org/portal/">
        <Button color="primary" component="a" fullWidth mt="md" radius="md">
          Add to Cart
        </Button>
      </Link>

      <div className="absolute top-2 right-2">
        <CopyButton value={`https://www.viaprize.org/portal/${link}`}>
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
