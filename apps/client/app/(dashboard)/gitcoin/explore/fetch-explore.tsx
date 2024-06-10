import GitcoinCard from '@/components/gitcoin/gitcoin-card';
import { fetchRoundByNodeId } from '@/lib/actions';

interface Application {
  nodeId: string;
  metadata: {
    application: {
      project: {
        bannerImg: string;
        description: string;
      };
    };
  };
  project: {
    name: string;
  };
  totalAmountDonatedInUsd: number;
  uniqueDonorsCount: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const arrayCopy = [...array];
  return arrayCopy.sort(() => Math.random() - 0.5);
}

export default async function FetchGitcoins() {
  const applicationsInRound = await fetchRoundByNodeId('WyJyb3VuZHMiLCI2MyIsNDIxNjFd');
  const shuffledApplications: Application[] = shuffleArray(
    applicationsInRound.roundByNodeId.applications,
  );

  return (
    <>
      {shuffledApplications.map((application: Application) => (
        <GitcoinCard
          id={application.nodeId}
          key={application.nodeId}
          imageURL={`https://ipfs.io/ipfs/${application.metadata.application.project.bannerImg}`}
          title={application.project.name}
          description={application.metadata.application.project.description}
          raised={application.totalAmountDonatedInUsd}
          contributors={application.uniqueDonorsCount}
          link={`/gitcoin/${application.nodeId}`}
        />
      ))}
    </>
  );
}
