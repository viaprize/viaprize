import { TextEditor } from '@/components/richtexteditor/textEditor';
import { Badge, Group, Text, Title } from '@mantine/core';
import { PrizeCreationTemplate } from './defaultcontent';

export default function AboutPrize({
  balanceWithDenomation,
}: {
  balanceWithDenomation: string;
}) {
  return (
    <div className="w-full mt-4">
      <Group justify="space-between" grow>
        <Text w={600}>Deadline: 30 March 2023</Text>
        <Badge color="green" className="h-8 font-bold">
          {balanceWithDenomation}
        </Badge>
      </Group>
      <div className="py-4">
        <Title order={4} className="mb-2">
          About the prize
        </Title>
        <TextEditor disabled richtext={PrizeCreationTemplate} />
      </div>
    </div>
  );
}
