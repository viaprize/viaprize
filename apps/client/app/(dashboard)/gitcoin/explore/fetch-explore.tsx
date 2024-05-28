import GitcoinCard from '@/components/Gircoin/gitcoin-card';
import { fetchRoundByNodeId } from '@/lib/actions';

export default async function FetchGitcoins() {
  const applicationsInRound = await fetchRoundByNodeId(
    'WyJyb3VuZHMiLCIweDAwZDVlMGQzMWQzN2NjMTNjNjQ1ZDg2NDEwYWI0Y2I3Y2I0MjhjY2EiLDQyMTYxXQ==',
  );
  return (
    <>
      {applicationsInRound.roundByNodeId.applications.map((application) => (
        <GitcoinCard
          key={application.nodeId}
          imageURL={application.project.name}
          title={application.project.name}
          by={application.createdByAddress}
          description={application.project.name}
          raised={application.totalAmountDonatedInUsd}
          contributors={application.uniqueDonorsCount}
          link={`/gitcoin/${application.nodeId}`}
        />
      ))}
    </>
  );
}
