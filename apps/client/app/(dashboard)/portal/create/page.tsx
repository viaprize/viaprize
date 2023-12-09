import { Card, Title } from '@mantine/core';
import PortalForm from './form';

export default function CreatePortal() {
  // const { appUser } = useAppUser();

  // if (!appUser) {
  //   return <div className='w-full h-screen grid place-content-center'>Login to create Portal</div>;
  // }

  return (
    <Card className="w-full p-8 m-6" mt="md" withBorder shadow="sm">
      <Title my="md" order={1}>
        Create a Portal
      </Title>
      <PortalForm />
    </Card>
  );
}
