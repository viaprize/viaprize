import useAppUser from '@/context/hooks/useAppUser';
import myAxios from '@/lib/axios';
import { Autocomplete, Button, Card, Center, Text, TextInput } from '@mantine/core';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

export default function Details() {
  const timeoutRef = useRef<number>(-1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [name, setName] = useState('');
  const { createNewUser } = useAppUser()
  /**
   * Mutation for logging in the user.
   * @type {import('react-query').UseMutationResult<any, unknown>}
   */
  const uploadUserMutation = useMutation(createNewUser,{
    onSuccess: (data) => {
      router.push('/prize/explore-prizes');
    }
  });
  
  const router = useRouter();
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

  const handleLogin = async () => {
    try {
      toast.promise(
        uploadUserMutation.mutateAsync({
          email,
          name
        }),
        {
          loading: 'Logging In',
          success: 'Logged In Successfully',
          error: 'Error Logging In',
        },
      );
      
    } catch (e) {
      console.log(e);
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
          onClick={handleLogin}
          loading={loading || uploadUserMutation.isLoading}
          disabled={loading || uploadUserMutation.isLoading}
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
