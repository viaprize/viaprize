import { ActionIcon, Button, Center, Flex, Group, Text, Title } from '@mantine/core';

import PrizePageTabs from './prizepagetabs';
import Submissions from './submissions';

export default function PrizePageComponent() {
  return (
    <div className="max-w-screen-lg px-6 py-6 shadow-md rounded-md min-h-screen my-6 relative">
      <Flex justify="space-between" my="lg">
        <Title order={2}>A simple Title for the prizes page</Title>
        <Group position="right" spacing="0" noWrap>
          <Button color="black" mx="5px">
            Upvote
          </Button>
          <ActionIcon variant="filled" size="lg" color="blue">
            <Text>20</Text>
          </ActionIcon>
        </Group>
      </Flex>
      <img
        className="aspect-video object-cover sm:max-h-[350px] max-h-[200px] md:max-h-[430px] max-w-full rounded-md"
        src="/placeholder.jpg"
        width={1280}
        height={768}
        alt="prize info tumbnail"
        // imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
      <Center my="xl">
        <PrizePageTabs />
      </Center>
      <Submissions />
    </div>
  );
}
