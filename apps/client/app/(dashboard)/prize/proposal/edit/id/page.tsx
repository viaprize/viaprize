import { Card, Title } from '@mantine/core';
import { Suspense } from 'react';

export default function ProposalEdit() {
  // You can access props.admins, props.description, etc. here
  return (
    <Card className="w-full p-8 m-6" mt="md" withBorder shadow="sm">
      <Title my="md" order={1}>
        Edit Portal
      </Title>
      <Suspense fallback={<div>Loading...</div>} >
s
        </Suspense>
    </Card>
  );
}
