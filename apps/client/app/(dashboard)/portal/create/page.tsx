import { Card } from '@mantine/core';
import PortalForm from './form';

export default function CreatePortal() {
  // const { appUser } = useAppUser();

  // if (!appUser) {
  //   return <div className='w-full h-screen grid place-content-center'>Login to create Portal</div>;
  // }

  return (
    <Card className="w-full p-8 m-6" mt="md" withBorder shadow="sm">
      <PortalForm />
    </Card>
  );
}
