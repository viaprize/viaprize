import { Api } from '@/lib/api';
import { Card, Title } from '@mantine/core';
import PortalProposalForm from './form';
import getCryptoToUsd from './CryptotoUsd';

export default async function EditPortalProposal({ params }: { params: { id: string } }) {
  const proposal = await new Api().portals.proposalsDetail(params.id, {
    next: {
      revalidate: 0,
    },
  });

  if (!proposal) {
    return <div>something went wrong</div>;
  }

  console.log(proposal);

  const price = await getCryptoToUsd();


  function convertCryptoToUSD(crypto: number | undefined) {
      if (!price) {
        return undefined;
      }
      if (!crypto) {
        return undefined;
      }
      const cryptoToUsd = price.ethereum.usd;
      const ethToCrypto = crypto * cryptoToUsd;
      return parseFloat(ethToCrypto.toFixed(4));
    }

  return (
    <Card className="w-full p-8 m-6" mt="md" withBorder shadow="sm">
      <Title my="md" order={1}>
        Edit Portal
      </Title>
      <PortalProposalForm
        id={params.id}
        allowDonationAboveThreshold={proposal.data.allowDonationAboveThreshold}
        deadline={proposal.data.deadline}
        description={proposal.data.description}
        fundingGoal={convertCryptoToUSD(proposal.data.fundingGoal)}
        title={proposal.data.title}
        treasurers={proposal.data.treasurers}
        user={proposal.data.user}
        sendImmediately={proposal.data.sendImmediately}
        images={proposal.data.images}
      />
    </Card>
  );
}
