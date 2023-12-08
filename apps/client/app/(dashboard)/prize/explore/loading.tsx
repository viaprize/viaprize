import { Card, Skeleton } from '@mantine/core';
import React from 'react'

export default function SkeletonLoad() {
  return (
    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}


function SkeletonCard() {
  return (
    <Card withBorder radius="md" shadow="md">
      <Skeleton height={150} width="100%" mb="xl" />
      <Skeleton height={10} width={100} radius="xl" />
      <Skeleton height={10} mt={6} radius="xl" />
      <Skeleton height={10} mt={6} width="70%" radius="xl" />
      <Skeleton height={10} mt={6} width="50%" radius="xl" />
      <Skeleton height={10} mt={6} width="90%" radius="xl" />
      <Skeleton height={30} mt={35} width="100%" radius="xl" />
    </Card>
  );
}