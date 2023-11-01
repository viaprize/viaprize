import AdminAcceptedCard from '@/components/Admin/acceptedCard';
import AdminCard from '@/components/Admin/card';
import usePrizeProposal from '@/components/Prize/hooks/usePrizeProposal';
import AppShellLayout from '@/components/layout/appshell';
import { PrizeProposals } from '@/lib/api';
import { Loader, Tabs, Text } from '@mantine/core';
import type { ReactElement } from 'react';
import { useQuery } from 'react-query';

const Proposals = ({
  isSuccess,
  data,
}: {
  isSuccess: boolean;
  data: PrizeProposals[] | undefined;
}) => {
  return (
    <>
      {isSuccess ? (
        data?.map((proposal: PrizeProposals) => (
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
        ))
      ) : (
        <Text>Error</Text>
      )}
    </>
  );
};

const AccpetedProposals = ({
  isSuccess,
  data,
}: {
  isSuccess: boolean;
  data: PrizeProposals[] | undefined;
}) => {
  return (
    <>
      {isSuccess ? (
        data?.map((proposal: PrizeProposals) => (
          <AdminAcceptedCard
            key={proposal.id}
            admins={proposal.admins}
            description={proposal.description}
            images={proposal.images}
            submission={proposal.submission_time}
            title={proposal.title}
            user={proposal.user}
            voting={proposal.voting_time}
          />
        ))
      ) : (
        <Text>Error</Text>
      )}
    </>
  );
};

export default function AdminPage() {
  const { getAllProposals, getAcceptedProposals } = usePrizeProposal();

  const getAllProposalsMutation = useQuery(['all-proposals', undefined], () => {
    return getAllProposals();
  });
  const getAcceptedProposalsMutation = useQuery(['accepted-proposals', undefined], () => {
    return getAcceptedProposals();
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
          <Proposals
            isSuccess={getAllProposalsMutation.isSuccess}
            data={getAllProposalsMutation.data}
          />
        )}
      </Tabs.Panel>

      <Tabs.Panel value="accepted" pt="xs">
        {getAcceptedProposalsMutation.isLoading ? (
          <Loader size="xl" variant="bars" />
        ) : (
          <AccpetedProposals
            isSuccess={getAcceptedProposalsMutation.isLoading}
            data={getAcceptedProposalsMutation.data}
          />
        )}
      </Tabs.Panel>
    </Tabs>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
