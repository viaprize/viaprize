import type { ReactElement } from 'react';
import type { UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import { Loader, Tabs } from '@mantine/core';
import AdminCard from '@/components/Admin/card';
import usePrizeProposal from '@/components/Prize/hooks/usePrizeProposal';
import AppShellLayout from '@/components/layout/appshell';
import type { AppUser } from 'types/app-user';
import type { PrizeProposalsList } from 'types/prizes';

const Proposals = ({
  mutation,
}: {
  mutation: UseQueryResult<PrizeProposalsList, unknown>;
}): ReactElement => {
  return mutation.isSuccess
    ? mutation.data.data.map(
        (proposal: {
          id: string;

          admins: string[];

          description: string;

          images: string[];

          submission_time: number;

          title: string;

          user: AppUser;

          voting_time: number;
        }) => (
          <AdminCard
            key={proposal.id}
            id={proposal.id}
            admins={proposal.admins}
            description={proposal.description}
            images={proposal.images}
            submission={proposal.submission_time}
            title={proposal.title}
            user={proposal.user}
            voting={proposal.voting_time}
          />
        ),
      )
    : 'Error';
};

export default function AdminPage() {
  const { getAllProposals } = usePrizeProposal();

  const getAllProposalsMutation = useQuery(['all-proposals', undefined], () => {
    return getAllProposals();
  });

  return (
    <Tabs variant="pills" defaultValue="pending">
      <Tabs.List>
        <Tabs.Tab value="pending">Pending Proposals</Tabs.Tab>

        <Tabs.Tab className="mx-2" value="accepted">
          Accepted Requests
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="pending" pt="xs">
        {getAllProposalsMutation.isLoading ? (
          <Loader size="xl" variant="bars" />
        ) : (
          <Proposals mutation={getAllProposalsMutation} />
        )}
      </Tabs.Panel>

      <Tabs.Panel value="accepted" pt="xs">
        {/* <AdminCard id="some-id" /> */}
      </Tabs.Panel>
    </Tabs>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
