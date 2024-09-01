'use client';

import useAuthPerson from '@/components/hooks/useAuthPerson';
import React from 'react';
import { useQuery } from 'react-query';
import useAppUser from '../hooks/useAppUser';
import { useUser } from '../hooks/useUser';

export default function AuthWrap({ children }: { children: React.ReactNode }) {
  const isProfileOwner = useAuthPerson();
  if (!isProfileOwner) {
    return null;
  }
  return <>{children}</>;
}
