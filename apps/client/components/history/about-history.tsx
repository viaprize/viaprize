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
  comment: string;
  winnersAmount: string;
  worklink: string;
  status: string;
  rawDescription: string;
}

export default function AboutHistory({
  title,
  imageUrl,
  awarded,
  comment,
  winnersAmount,
  worklink,
  status,
  rawDescription,
}: AboutHistoryProps) {
  return (
    <div className="max-w-screen-lg px-6 py-6 shadow-md rounded-md min-h-screen my-6 relative">
      <Title order={2} mb="sm">
        {title}
      </Title>

      <Image
        className="aspect-video object-fill sm:max-h-[350px] max-h-[200px] md:max-h-[430px] max-w-full rounded-md o "
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
            <Divider my="sm" />
            <p
              // eslint-disable-next-line react/no-danger
              className="border-solid border-2  px-3"
              dangerouslySetInnerHTML={{ __html: rawDescription }}
            />
            {/* <TextEditor disabled richtext={description} /> */}
            {/* <p>{description}</p> */}
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
            <Divider my="md" variant="dotted" />
            {comment && (
              <>
                <Text size="lg" fw="bold" c="gray">
                  Comment by Winner
                </Text>
                <p
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: comment }}
                />
              </>
            )}
          </Paper>
        </div>
      </Center>
    </div>
  );
}
