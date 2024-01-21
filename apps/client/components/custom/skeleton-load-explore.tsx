import { Card, Skeleton } from '@mantine/core';

export default function SkeletonLoad({
  numberOfCards = 6,
  gridedSkeleton = false,
}: {
  numberOfCards?: number;
  gridedSkeleton?: boolean;
}) {
  if (gridedSkeleton) {
    return (
      <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {[...Array(numberOfCards)].map((_, index) => (
          <SkeletonCard key={index * 2} />
        ))}
      </div>
    );
  }
  return (
    <>
      {[...Array(numberOfCards)].map((_, index) => (
        <SkeletonCard key={index * 2} />
      ))}
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
