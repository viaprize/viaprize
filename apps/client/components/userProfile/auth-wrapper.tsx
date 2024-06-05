'use client';

import useAuthPerson from '@/components/hooks/useAuthPerson';
import React from 'react';
import useAppUser from '../hooks/useAppUser';
import { useUser } from '../hooks/useUser';
import { useQuery } from 'react-query';

export default function AuthWrap({ children }: { children: React.ReactNode }) {

  const isProfileOwner = useAuthPerson();
  if (!isProfileOwner) {
    return null;
  }
  return <>{children}</>;
}
