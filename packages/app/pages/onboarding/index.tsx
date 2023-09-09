import myAxios from '@/lib/axios';
import { Autocomplete, Button, Card, Center, Text, TextInput } from '@mantine/core';
import { usePrivy } from '@privy-io/react-auth';
import React, { useRef, useState } from 'react';
import { useMutation } from 'react-query';

export default function Details() {
  const timeoutRef = useRef<number>(-1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [name, setName] = useState('');
  const { user } = usePrivy()
  const { mutateAsync: uploadProfile, isLoading } = useMutation(async ({ name, email }: { name: string, email: string }) => {
    return await myAxios.post('/users', { name, email, address: user?.wallet?.address, userId: user?.id })

  })

  const handleChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setEmail(val);
    setData([]);

    if (val.trim().length === 0 || val.includes('@')) {
      setLoading(false);
    } else {
      setLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);
        setData(['gmail.com', 'outlook.com', 'yahoo.com'].map((provider) => `${val}@${provider}`));
      }, 1000);
    }
  };

  return (
    <Center className="h-[80dvh]">
      <Card shadow="md" radius="md" withBorder className="w-[50vw]">
        <Text>Enter your details to get started</Text>
        <TextInput
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          label="Name"
          placeholder="Enter your name"
          my="sm"
        />
        <Autocomplete
          value={email}
          onChange={handleChange}
          label="Email"
          placeholder="Enter your email"
          data={data}
          my="sm"
        />
        <Button
          onClick={async () => {
            await uploadProfile({
              email,
              name
            })
          }}
          loading={loading || isLoading}
          disabled={loading || isLoading}
          color="blue"
          fullWidth
          my="sm"
        >
          Get Started
        </Button>
      </Card>
    </Center>
  );
}
