import { Card, Title } from '@mantine/core';
import PortalForm from './form';

export default function CreatePortal() {
  // const { appUser } = useAppUser();

  // if (!appUser) {
  //   return <div className='w-full h-screen grid place-content-center'>Login to create Portal</div>;
  // }

  return (
    <Card className="w-full m-0 sm:m-6 p-3 sm:p-8" mt="md" withBorder shadow="sm">
      <Title my="md" order={1}>
        Create a Portal
      </Title>
      <PortalForm />
    </Card>
  );
}
