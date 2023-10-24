import type { ReactElement } from 'react';
import React from 'react';
import PrizePageComponent from '@/components/Prize/prizepage/prizepage';
import AppShellLayout from '@/components/layout/appshell';

export default function PrizePage() {
  return (
    <div className="flex justify-center w-full">
      <PrizePageComponent />
    </div>
  );
}

PrizePage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
