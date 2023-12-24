import { TextEditor } from '@/components/richtexteditor/textEditor';
import { chain } from '@/lib/wagmi';
import { Badge, Group, Title } from '@mantine/core';

export default function AboutPrize({
  balanceWithDenomation,
  description,
  contractAddress,
}: {
  balanceWithDenomation: string;
  description: string;
  contractAddress: string;
}) {
  console.log({ contractAddress }, 'contractAddress');
  return (
    <div className="w-full mt-4">
      <Group justify="space-between">
        <Badge color="green" className="h-8 font-bold">
          {balanceWithDenomation}
        </Badge>
      </Group>
      <div className="py-4">
        <Title order={4} className="mb-2">
          About the prize
        </Title>
        <Title order={6}>
          Contract Address on {chain.name.toUpperCase()} (You can donate to this address
          also): {contractAddress}
        </Title>
        <TextEditor disabled richtext={description} />
      </div>
    </div>
  );
}
