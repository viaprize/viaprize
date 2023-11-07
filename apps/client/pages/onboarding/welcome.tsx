import { Button, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';

export default function Example() {
  const router = useRouter();

  return (
    <div className="flex py-24 w-full items-center justify-center">
      <div className="w-full max-w-lg flex flex-col justify-center items-center">
        <img alt="viaPrize logo" src="/viaPrize.png" className="max-w-sm" />
        <Title className="my-4" order={2}>
          Welcome to viaPrize
        </Title>
        <Text className="text-center" variant="lead" color="gray" my="md">
          viaPrize is the only platform in the world that allows anyone to launch their
          own crowdfunded prize and win bounties for their work.
        </Text>
        <Button
          //   className="btn text-white btn-primary btn-wide my-3"
          onClick={async () => {
            await router.push('/onboarding/details');
          }}
          fullWidth
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
