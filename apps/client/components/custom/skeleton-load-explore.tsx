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
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {Array.from({ length: numberOfCards }).map(() => (
          <SkeletonCard key={length} />
        ))}
      </div>
    );
  }
  return (
    <>
      {Array.from({ length: numberOfCards }).map(() => (
        <SkeletonCard key={length} />
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
