import AppShellLayout from '@/components/layout/appshell';
import React, { ReactElement } from 'react';

export default function EditorID() {
  return <div></div>;
}

EditorID.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
