import { fetchApplicationByNodeId } from '@/lib/actions';
import { Text } from '@mantine/core';
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
  console.log(params.slug);
  const applicationsInRound = await fetchApplicationByNodeId(
    decodeURIComponent(params.slug),
  );
  console.log(applicationsInRound);

  return (
    <div className="my-10 px-3 sm:px-6 md:px-14 lg:px-20">
      <ImageTitleCard
        title="SOLARPUNK GUILD, gamifying hypercerts for Guild Members impact assessment "
        name="by 0xEB7...7B9D0"
        img="https://d16c97c2np8a2o.cloudfront.net/ipfs/bafkreigf6g54vvjcbqogij5dri5iauvqbmhbpsgoasvm5scapjpp56k6ji?img-height=640"
      />
      <div className="w-full lg:flex gap-4 justify-between mt-3">
        <SocialCard
          createdOn="29th May"
          website="www.google.com"
          twitter="www.google.com"
        />
        <DetailCard fundingRecieved={0} daysLeft={0} contributors={0} />
      </div>
      <Text size="xl" mt="md" fw="bold">
        About
      </Text>
      <p>
        WHAT WE HAVE BUILT SO FAR Our roadmap 2022: Founders circle and project initiation
        2023: Formalization of the Guild with 60 members, initial governance and first
        community activities 2024: DAOfication and activation of activities on the ground
        (solarpunk seasons) 2025: Guild events, expansion of the IRL activities,
        activation of Guild’s fundraising pool through stacking and external grants Our
        milestones October 2022 foundation January 2023 launch of Gitcoin Marathon with
        pledge mechanism April 2023 launch of Gitcoin Community Radio December 2023
        Governance formalization April 2024 launch of the Solarpunk Stack
      </p>
    </div>
  );
}
