import { Api } from '@/lib/api';
import PortalProposalForm from './form';

export default async function EditPortalProposal({ params }: { params: { id: string } }) {

  const proposal = await new Api().portals.proposalsDetail(params.id, {
    next: {
      revalidate: 0,
    },
  });

  if (!proposal) {
    return <div>something went wrong</div>;
  }

  return <PortalProposalForm id={params.id} 
  allowDonationAboveThreshold={proposal.data.allowDonationAboveThreshold}
  deadline={proposal.data.deadline}
  description={proposal.data.description}
  fundingGoal={proposal.data.fundingGoal}
  title={proposal.data.title}
  treasurers={proposal.data.treasurers}
  user={proposal.data.user}
  />;
}
