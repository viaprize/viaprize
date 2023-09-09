import AppShellLayout from '@/components/layout/appshell';
import React, { ReactElement } from 'react';

export default function Profile() {
  return <div>Profile</div>;
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
