import PrizePageComponent from '@/components/Prize/prizepage/prizepage';
import AppShellLayout from '@/components/layout/appshell';
import React, { ReactElement } from 'react';

export default function PrizePage() {
  return (
    <>
      <div className="flex justify-center w-full">
        <PrizePageComponent />
      </div>
    </>
  );
}

PrizePage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
