import { Skeleton } from '@mantine/core';
import React from 'react'

export default function SkeletonLoad() {
  return (
    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
      <Skeleton height={100} circle mb="xl" />
    </div>
  );
}
