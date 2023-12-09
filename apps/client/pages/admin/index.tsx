import AdminAcceptedCard from '@/components/Admin/acceptedCard';
import AdminCard from '@/components/Admin/card';
import PortalAdminCard from '@/components/Admin/portalAdminCard';
import usePortalProposal from '@/components/hooks/usePortalProposal';
import usePrizeProposal from '@/components/hooks/usePrizeProposal';
import AppShellLayout from '@/components/layout/appshell';
import { PortalProposals, PrizeProposals } from '@/lib/api';
import { Loader, Tabs, Text } from '@mantine/core';
import type { ReactElement } from 'react';
import { useQuery } from 'react-query';



const Proposals = ({
  isSuccess,
  data,
}: {
  isSuccess: boolean;
  data: {
    prizesProposals: PrizeProposals[] | undefined,
    portalsProposals: PortalProposals[] | undefined
  };
}) => {
  return (
    <>
      {isSuccess ? (
        <> {data.prizesProposals?.map((proposal: PrizeProposals) => (
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
        ))}
          {
            data.portalsProposals?.map((portalProposal: PortalProposals) => (
              <PortalAdminCard
                tresurers={portalProposal.treasurers}
                allowAboveFundingGoal={portalProposal.allowDonationAboveThreshold}
                deadline={portalProposal.deadline}
                description={portalProposal.description}
                images={portalProposal.images}
                title={portalProposal.title}
                user={portalProposal.user}
                fundingGoal={portalProposal.fundingGoal}
                id={portalProposal.id}
              />
            ))
          }
        </>
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
  const { getAllProposals: getAllPrizeProposals, getAcceptedProposals } = usePrizeProposal();
  const { getAllProposals: getAllPortalProposal } = usePortalProposal()
  const getAllPrizeProposalsMutation = useQuery(['all-prize-proposals', undefined], () => {
    return getAllPrizeProposals()
  });
  const getAllPortalProposalsMutation = useQuery(['all-portal-proposals', undefined], () => {
    return getAllPortalProposal()
  })

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
        {getAllPrizeProposalsMutation.isLoading ? (
          <Loader size="xl" variant="bars" />
        ) : (
          <Proposals
            isSuccess={getAllPrizeProposalsMutation.isSuccess && getAllPrizeProposalsMutation.isSuccess}
            data={{
              portalsProposals: getAllPortalProposalsMutation.data,
              prizesProposals: getAllPrizeProposalsMutation.data

            }}
          />
        )}
      </Tabs.Panel>

      <Tabs.Panel value="accepted" pt="xs">
        {getAcceptedProposalsMutation.isLoading ? (
          <Loader size="xl" variant="bars" />
        ) : (
          <AccpetedProposals
            isSuccess={getAcceptedProposalsMutation.isSuccess}
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
