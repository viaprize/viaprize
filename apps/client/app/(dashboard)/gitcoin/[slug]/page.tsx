import { fetchApplicationByNodeId, fetchRoundByNodeId } from '@/lib/actions';
import { Text } from '@mantine/core';
import { marked } from 'marked';
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
  const applicationsInRound = await fetchApplicationByNodeId(
    decodeURIComponent(params.slug),
  );
  const round = await fetchRoundByNodeId('WyJyb3VuZHMiLCI2MyIsNDIxNjFd');

  return (
    <div className="my-10 px-3 sm:px-6 md:px-14 lg:px-20">
      <ImageTitleCard
        title={applicationsInRound.applicationByNodeId.project.name}
        img={`https://ipfs.io/ipfs/${applicationsInRound.applicationByNodeId.metadata.application.project.bannerImg}`}
      />
      <div className="w-full lg:flex gap-4 justify-between mt-3">
        <SocialCard
          createdOn={
            applicationsInRound.applicationByNodeId.metadata.application.project.createdAt
          }
          website={
            applicationsInRound.applicationByNodeId.metadata.application.project.website
          }
          twitter={
            applicationsInRound.applicationByNodeId.metadata.application.project
              .projectTwitter
          }
        />
        <DetailCard
          fundingRecieved={
            applicationsInRound.applicationByNodeId.totalAmountDonatedInUsd
          }
          daysLeft={round.roundByNodeId.donationsEndTime}
          contributors={applicationsInRound.applicationByNodeId.uniqueDonorsCount}
        />
      </div>
      <Text size="xl" mt="md" fw="bold">
        About
      </Text>
      <Description
        description={
          applicationsInRound.applicationByNodeId.metadata.application.project.description
        }
      />
    </div>
  );
}
