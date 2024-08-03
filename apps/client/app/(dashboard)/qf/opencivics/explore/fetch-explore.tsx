import GitcoinCard from '@/components/gitcoin/gitcoin-card';
import { fetchRoundForExplorer } from '@/lib/actions';
import { gitcoinRoundData } from '@/lib/constants';
import { Application } from 'types/gitcoin.types';

export const dynamic = 'force-dynamic';
function shuffleArray<T>(array: T[]): T[] {
  const arrayCopy = [...array];
  return arrayCopy.sort(() => Math.random() - 0.5);
}

export default async function FetchGitcoins() {
  const applicationsInRound = await fetchRoundForExplorer(
    gitcoinRoundData.chainId,
    gitcoinRoundData.roundId,
  );
  const shuffledApplications: Application[] = shuffleArray(
    applicationsInRound.applications,
  );
  console.log(shuffledApplications);

  return (
    <>
      {shuffledApplications.map((application: Application) => (
        <GitcoinCard
          id={application.id}
          key={application.id}
          imageURL={`https://ipfs.io/ipfs/${application.project.metadata.bannerImg}`}
          title={application.project.metadata.title}
          description={application.project.metadata.description}
          raised={application.totalAmountDonatedInUsd}
          contributors={application.uniqueDonorsCount}
          link={`/qf/opencivics/${application.id}`}
          application={application}
        />
      ))}
    </>
  );
}
