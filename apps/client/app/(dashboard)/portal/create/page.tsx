'use client';
import { Card, Title } from '@mantine/core';
import PortalForm from './form';
import useAppUser from '@/components/hooks/useAppUser';
import ShouldLogin from '@/components/custom/should-login';

export default function CreatePortal() {
  const { appUser } = useAppUser();

  if (!appUser) {
    return <ShouldLogin text="Please login to create a portal" />;
  }

  return (
    <Card className="w-full m-0 sm:m-6 p-3 sm:p-8" mt="md" withBorder shadow="sm">
      <Title my="md" order={1}>
        Create a Portal
      </Title>
      <PortalForm />
    </Card>
  );
}
