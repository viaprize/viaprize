import { Api } from '@/lib/api';
import { Card, Title } from '@mantine/core';
import { Suspense } from 'react';
import PrizeEdit from './form';

export default async function ProposalEdit({ params }: { params: { id: string } }) {
  // You can access props.admins, props.description, etc. here
  const prize = (
    await new Api().prizes.proposalsDetail(params.id, {
      next: {
        revalidate: 0,
      },
    })
  ).data;

  console.log(prize, 'prize');

  return (
    <Card className="w-full p-8 m-6" mt="md" withBorder shadow="sm">
      <Title my="md" order={1}>
        Edit Portal
      </Title>
      <Suspense fallback={<div>Loading...</div>}>
        <PrizeEdit
          tadmins={prize.admins}
          tdescription={prize.description}
          timages={prize.images}
          tisAutomatic={prize.isAutomatic}
          tjudges={prize.judges ?? []}
          tpriorities={prize.priorities}
          tproficiencies={prize.proficiencies}
          tsubmissionTime={prize.submission_time}
          ttitle={prize.title}
          tvotingTime={prize.voting_time}
          proposalId={params.id}
        />
      </Suspense>
    </Card>
  );
}
