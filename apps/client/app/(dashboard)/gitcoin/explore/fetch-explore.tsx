import GitcoinCard from '@/components/gitcoin/gitcoin-card';
import { fetchRoundByNodeId } from '@/lib/actions';

export default async function FetchGitcoins() {
  const applicationsInRound = await fetchRoundByNodeId('WyJyb3VuZHMiLCI2MyIsNDIxNjFd');
  return (
    <>
      {applicationsInRound.roundByNodeId.applications.map((application) => (
        <GitcoinCard
          id={application.nodeId}
          key={application.nodeId}
          imageURL={`https://ipfs.io/ipfs/${application.metadata.application.project.bannerImg}`}
          title={application.project.name}
          description={application.metadata.application.project.description}
          raised={application.totalAmountDonatedInUsd}
          contributors={application.uniqueDonorsCount}
          link={`/gitcoin/${application.nodeId}`} />
      ))}
    </>
  );
}
