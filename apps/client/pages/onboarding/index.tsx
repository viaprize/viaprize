import {
  Autocomplete,
  Button,
  Card,
  Center,
  Flex,
  Loader,
  Text,
  TextInput,
} from '@mantine/core';

import useAppUser from '@/context/hooks/useAppUser';
import { Api } from '@/lib/api';
import { sleep } from '@/lib/utils';
import { useDebouncedValue } from '@mantine/hooks';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

export default function Details() {
  const timeoutRef = useRef<number>(-1);
  const { user } = usePrivy();
  const [email, setEmail] = useState(user?.email?.address || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const { createNewUser } = useAppUser();
  const uploadUserMutation = useMutation(createNewUser, {
    onSuccess: () => {
      router.push('/prize/explore').then(console.log).catch(console.error);
    },
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
        setData(
          ['gmail.com', 'outlook.com', 'yahoo.com'].map(
            (provider) => `${val}@${provider}`,
          ),
        );
      }, 1000);
    }
  };

  const handleLogin = () => {
    try {
      toast.promise(
        uploadUserMutation.mutateAsync({
          email,
          name,
          username,
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

  const [debouncedUsername] = useDebouncedValue(username, 200);

  const [exists, setExists] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);

  const checkUsername = useCallback(
    async (newusername: string) => {
      try {
        console.log('checking newusername', newusername);
        const response = await new Api().users.existsDetail(newusername);
        setExists(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setUsernameLoading(false);
      }
    },
    [debouncedUsername],
  );

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.toLowerCase();
    setUsernameLoading(true);
    setUsername(value);
    sleep(1000)
      .then(() => {
        checkUsername(value).catch(console.error);
      })
      .catch(console.error);
  };

  return (
    <Center className="h-[80dvh]">
      <Card shadow="md" radius="md" withBorder className="w-[50vw]">
        <Text>Enter your details to get started</Text>
        <TextInput
          value={username}
          onChange={handleUsernameChange}
          label="Username"
          placeholder="Enter your username"
        />

        <Flex>
          {usernameLoading && <Loader m="xs" size={'xs'} />}
          {!usernameLoading &&
            debouncedUsername.length > 0 &&
            (exists && debouncedUsername.length > 0 ? (
              <Text c="red">Username already exists</Text>
            ) : (
              <Text c="green">{username} Is a Valid Username</Text>
            ))}
        </Flex>
        <TextInput
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
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
          disabled={loading || uploadUserMutation.isLoading || exists}
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
