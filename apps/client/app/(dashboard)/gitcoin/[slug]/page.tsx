import { fetchApplicationByNodeId } from '@/lib/actions';
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
  console.log(params.slug);
  const applicationsInRound = await fetchApplicationByNodeId(
    decodeURIComponent(params.slug),
  );
  console.log(applicationsInRound);

  const projectDescriptionMarkdown =
    applicationsInRound.applicationByNodeId.metadata.application.project.description;
  const projectDescriptionHtml = marked(projectDescriptionMarkdown);

  return (
    <div className="my-10 px-3 sm:px-6 md:px-14 lg:px-20">
      <ImageTitleCard
        title={applicationsInRound.applicationByNodeId.project.name}
        name={applicationsInRound.applicationByNodeId.project.createdByAddress}
        img={`https://ipfs.io/ipfs/${applicationsInRound.applicationByNodeId.metadata.application.project.bannerImg}`}
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
      <Description
        description={
          applicationsInRound.applicationByNodeId.metadata.application.project.description
        }
      />
    </div>
  );
}
