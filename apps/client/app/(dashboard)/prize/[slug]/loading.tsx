import { Card, Skeleton } from '@mantine/core';

export default function PrizeLoading() {
  return (
    <Card radius="md" withBorder mt="lg" w="100%">
      <Skeleton radius="30px" height={300} circle mb="xl" />
      <Skeleton height={20} width={900} radius="xl" />
      <Skeleton height={20} mt={6} radius="xl" />
      <Skeleton height={20} mt={6} width="70%" radius="xl" />
      <Skeleton height={20} mt={6} width="50%" radius="xl" />
    </Card>
  );
}
