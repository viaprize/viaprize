import { TextEditor } from '@/components/richtexteditor/textEditor';
import { Badge, Group, Title } from '@mantine/core';
import { PrizeCreationTemplate } from './defaultcontent';

export default function AboutPrize() {
  return (
    <div className="w-full mt-4">
      <Group justify="space-between" >
        <h3>Deadline: 30 March 2023</h3>
        <Badge color="green" className="h-8 font-bold">
          $500
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
