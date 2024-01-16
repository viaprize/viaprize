import { Card, Skeleton } from '@mantine/core';

export default function SkeletonLoad() {
  return (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  );
}

function SkeletonCard() {
  return (
    <Card withBorder radius="lg" shadow="md" className="w-full my-4">
      <Skeleton height={150} width="100%" mb="xl" />
      <Skeleton height={10} width={380} radius="xl" />
      <Skeleton height={10} mt={6} radius="xl" />
      <Skeleton height={10} mt={6} width="70%" radius="xl" />
      <Skeleton height={10} mt={6} width="50%" radius="xl" />
      <Skeleton height={10} mt={6} width="90%" radius="xl" />
      <Skeleton height={30} mt={35} width="100%" radius="xl" />
    </Card>
  );
}
