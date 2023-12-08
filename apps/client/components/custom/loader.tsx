import { useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';

function HourLoader() {
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    async function getLoader() {
      const { hourglass } = await import('ldrs');
      hourglass.register();
    }
    void getLoader();
  }, []);
  return <l-hourglass color={colorScheme === 'dark' ? 'white' : 'black'} />;
}

export function OwnLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      {/* <Loader size="md" /> */}
      <HourLoader />
    </div>
  );
}
