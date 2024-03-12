import {
  Badge,
  Divider,
  Flex,
  Text,
  Title,
  Center,
  Box,
  Paper,
  Group,
} from '@mantine/core';
import Image from 'next/image';
import { TextEditor } from '../richtexteditor/textEditor';

interface AboutHistoryProps {
  title: string;
  imageUrl: string;
  awarded: string;
  description: string;
  winnersAmount: string;
  worklink: string;
  status: string;
}

export default function AboutHistory({
  title,
  imageUrl,
  awarded,
  description,
  winnersAmount,
  worklink,
  status,
}: AboutHistoryProps) {
  return (
    <div className="max-w-screen-lg px-6 py-6 shadow-md rounded-md min-h-screen my-6 relative">
      <Title order={2} mb="sm">
        {title}
      </Title>

      <Image
        className="aspect-video object-cover sm:max-h-[350px] max-h-[200px] md:max-h-[430px] max-w-full rounded-md"
        src={imageUrl}
        width={1280}
        height={768}
        alt="prize info tumbnail"
      />
      <Center my="xl">
        <div className="w-full mt-4 min-w-0">
          <Group justify="space-between">
            <Flex gap="sm" justify="flex-start">
              <Text
                c="gray"
                variant="light"
                mb="sm"
                className="lg:text-3xl md:text-2xl text-lg"
              >
                Awarded :
              </Text>
              <Text fw="bold" c="blue" className="lg:text-3xl md:text-2xl text-lg">
                {`${awarded} USD`}
              </Text>
            </Flex>
            <Badge
              color={status === 'Won' ? 'green' : 'yellow'}
              variant="filled"
              size="lg"
              p="md"
            >
              {status}
            </Badge>
          </Group>
          <div className="py-4">
            <Text size="xl" fw="bold" className="mb-2 ">
              About this Prize
            </Text>

            <TextEditor disabled richtext={description} />
          </div>
          <Paper shadow="sm" radius="md" p="md">
            <Flex align="center">
              <Text size="lg" fw="bold" mr="xs" c="teal">
                Winners:
              </Text>
              <Divider />
              <Text size="md" fw="bold">
                {winnersAmount ? winnersAmount : 'No winners for this prize'}
              </Text>
            </Flex>
            <Flex align="center">
              <Text size="lg" fw="bold" mr="xs" c="blue">
                Work:
              </Text>
              <Divider />
              <Text size="md">{worklink ? worklink : 'No work link available'}</Text>
            </Flex>
          </Paper>
        </div>
      </Center>
    </div>
  );
}
