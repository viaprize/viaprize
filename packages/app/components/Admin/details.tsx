import React from 'react';
import Image from 'next/image';
import { Card, Flex, Group } from '@mantine/core';
import { TextEditor } from '../popupComponents/textEditor';
import { PrizeCreationTemplate } from '../Prize/prizepage/defaultcontent';
import PrizeFunderCard from '../Prize/prizepage/prizeFunderCard';

export default function ViewDetails() {
  return (
    <Flex direction="column" gap="sm">
      <Image
        src="/placeholder.jpg"
        height={160}
        width={300}
        alt="Image"
        className="object-cover w-full"
      />
      <div>
        <h2>Title is here</h2>
        <TextEditor disabled richtext={PrizeCreationTemplate} />
      </div>
      <PrizeFunderCard />
      <div>
        Admin wallets
        <Card shadow="sm" padding="lg" radius="md" withBorder mt="sm">
            1. sdajklfhkjhsakfjhsdakjhfkljdshakljfgl
        </Card>
        <Group grow  my='sm'>
        <Card>
            Voting days: 10
        </Card>
        <Card>
            Submission days: 10
        </Card>
        </Group>
      </div>
    </Flex>
  );
}
