import type { ReactElement } from 'react';
import React from 'react';
import AppShellLayout from '@/components/layout/appshell';

export default function EditorID() {
  return <div />;
}

EditorID.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
