import { ActionIcon, Button, Center, Flex, Group, Text, Title } from '@mantine/core';

import useAppUser from '@/context/hooks/useAppUser';
import { PrizeWithBlockchainData } from '@/lib/api';
import EndVoting from './buttons/endVoting';
import StartSubmission from './buttons/startSubmission';
import StartVoting from './buttons/startVoting';
import PrizePageTabs from './prizepagetabs';
import Submissions from './submissions';

export default function PrizePageComponent({
  prize,
}: {
  prize: PrizeWithBlockchainData;
}) {
  const { appUser } = useAppUser();

  return (
    <div className="max-w-screen-lg px-6 py-6 shadow-md rounded-md min-h-screen my-6 relative">
      <Flex justify="space-between" my="lg">
        <Title order={2}>{prize.title}</Title>
        <Group justify="right" gap="0" wrap="nowrap">
          <Button color="black" mx="5px">
            Upvote
          </Button>
          <ActionIcon variant="filled" size="lg" color="blue">
            <Text>0</Text>
          </ActionIcon>
        </Group>
      </Flex>
      <img
        className="aspect-video object-cover sm:max-h-[350px] max-h-[200px] md:max-h-[430px] max-w-full rounded-md"
        src={prize.images[0]}
        width={1280}
        height={768}
        alt="prize info tumbnail"
        // imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
      <Center my="xl">
        <PrizePageTabs />
      </Center>
      {appUser &&
        appUser.username === prize.user.username &&
        prize.submission_time === 0 && (
          <StartSubmission contractAddress={prize.contract_address} />
        )}
      {appUser &&
        appUser.username === prize.user.username &&
        prize.submission_time > 0 &&
        prize.voting_time === 0 && (
          <StartVoting contractAddress={prize.contract_address} />
        )}
      {appUser?.isAdmin && prize.submission_time > 0 && (
        <EndVoting contractAddress={prize.contract_address} />
      )}
      {appUser?.isAdmin && prize.voting_time > 0 && (
        <EndVoting contractAddress={prize.contract_address} />
      )}
      <Submissions />
    </div>
  );
}
