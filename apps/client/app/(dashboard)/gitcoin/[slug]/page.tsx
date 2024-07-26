import { fetchApplicationById, fetchRoundForExplorer } from '@/lib/actions';
import { Text } from '@mantine/core';
import Description from './description';
import DetailCard from './detail-card';
import ImageTitleCard from './image-title-card';
import SocialCard from './social-card';

export default async function GitcoinApplication({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const applicationsInRound = await fetchApplicationById(params.slug, 8453, '31');
  const round = await fetchRoundForExplorer(8453, '31');
  console.log(applicationsInRound);
  return (
    <div className="my-10 px-3 sm:px-6 md:px-14 lg:px-20">
      <ImageTitleCard
        title={applicationsInRound.project.metadata.title}
        img={`https://ipfs.io/ipfs/${applicationsInRound.project.metadata.bannerImg}`}
      />
      <div className="w-full lg:flex gap-4 justify-between mt-3">
        <SocialCard
          createdOn={applicationsInRound.project.metadata.createdAt}
          website={applicationsInRound.project.metadata.website}
          twitter={applicationsInRound.project.metadata.projectTwitter ?? ''}
        />
        <DetailCard
          fundingRecieved={applicationsInRound.totalAmountDonatedInUsd}
          daysLeft={round.donationsEndTime}
          contributors={applicationsInRound.uniqueDonorsCount}
        />
      </div>
      <Text size="xl" mt="md" fw="bold">
        About
      </Text>
      <Description description={applicationsInRound.project.metadata.description} />
    </div>
  );
}
