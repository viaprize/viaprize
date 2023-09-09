import PrizePageComponent from '@/components/Prize/prizepage/prizepage';
import AppShellLayout from '@/components/layout/appshell';
import React from 'react';

export default function PrizePage() {
  return (
    <AppShellLayout>
      <div className="flex justify-center w-full">
        <PrizePageComponent />
      </div>
    </AppShellLayout>
  );
}
