import { Card, TypographyStylesProvider, Text, Avatar, Group, Button, ActionIcon } from '@mantine/core';
import { IconArrowAutofitUp } from '@tabler/icons-react';
import React from 'react';

interface SubmissionsCardProps {
  fullname: string;
  submission: string;
  wallet: string;
  time: string;
  votes: number;
  onUpVote?: () => void;
  submissionId: string;
}

export default function SubmissionsCard({
  fullname,
  submission,
  wallet,
  time,
  votes,
  onUpVote,
  submissionId,
}: SubmissionsCardProps) {
  return (
    <Card className="flex flex-col justify-center gap-3">
      <div className="flex justify-between items-center">
        <Group>
          <Avatar color="blue" radius="md" alt="creator" className="rounded-sm" />
          <div>
            <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
              {fullname}
            </Text>
            {/* <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
            Proposer Email: {email}
          </Text> */}
            <Text c="dimmed" fz="sm">
              {wallet}
            </Text>
          </div>
        </Group>
        <Group>
          <Text c="dimmed" fz="sm">
            {time}
          </Text>
          <Group position="right" spacing="0" noWrap>
            <Button color="black" mx="5px">
              vote
            </Button>
            <ActionIcon variant="filled" size="lg" color="blue">
              <Text>20</Text>
            </ActionIcon>
          </Group>
        </Group>
      </div>
      <Text lineClamp={3}>
        <TypographyStylesProvider>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt nulla quam aut sed
            corporis voluptates praesentium inventore, sapiente ex tempore sit consequatur debitis
            non! Illo cum ipsa reiciendis quidem facere, deserunt eos totam impedit. Vel ab, ipsum
            veniam aperiam odit molestiae incidunt minus, sint eos iusto earum quaerat vitae
            perspiciatis.
          </p>
        </TypographyStylesProvider>
      </Text>
      <Button rightIcon={<IconArrowAutofitUp size="1rem" />}>View Submission</Button>
    </Card>
  );
}
