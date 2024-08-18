'use client';

import {
  Autocomplete,
  Button,
  Card,
  Center,
  Flex,
  Loader,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

import useAppUser from '@/components/hooks/useAppUser';
import { Api } from '@/lib/api';
import { sleep } from '@/lib/utils';
import { useDebouncedValue } from '@mantine/hooks';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import { IconLock } from '@tabler/icons-react';


export default function Details() {
  const timeoutRef = useRef<number>(-1);
  const { user } = usePrivy();
  const [email, setEmail] = useState(user?.email?.address || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [emailLocked, setEmailLocked] = useState(Boolean(user?.email?.address));
  const [emailExists, setEmailExists] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
const [walletAddress, setWalletAddress] = useState('');
  const { createNewUser, getLastVisitedPage } = useAppUser();

  const uploadUserMutation = useMutation(createNewUser, {
    onSuccess: () => {
      const lastVisitedPage = getLastVisitedPage(); // Get the last visited page
      router.push(lastVisitedPage);
      // router.push('/prize/explore');
    },
  });

  const router = useRouter();
  const { logoutUser } = useAppUser();

  const handleLogin = () => {
    try {
      toast.promise(
        uploadUserMutation.mutateAsync({
          email,
          name,
          username,
          bio,
          walletAddress: user?.wallet?.address,
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
  const [debouncedEmail] = useDebouncedValue(email, 200);

  const [exists, setExists] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const logout = async () => {
    setLogoutLoading(true);
    await logoutUser()
      .catch((error) => {
        console.log('error logging out');
        console.error(error);
      })
      .finally(() => {
        setLogoutLoading(false);
      });
  };

  const checkUsername = useCallback(
    async (newusername: string) => {
      try {
        console.log('checking newusername', newusername);
        const response = await new Api().users.existsDetail(newusername);
        setExists(response.data);
        console.log('response', response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setUsernameLoading(false);
      }
    },
    [debouncedUsername],
  );

const checkEmail = useCallback(async () => {
  try {
    console.log('checking newEmail', debouncedEmail);
    const response = await new Api().users.existsEmailDetail(debouncedEmail);
    setEmailExists(response.data.exists);

    if (response.data.exists && response.data.walletAddress) {
      // setEmailLocked(true); // Optionally lock the email field if it's already associated with a user
      setWalletAddress(response.data.walletAddress);
    } else {
      setWalletAddress(''); // Clear if no wallet is found
    }

    console.log('response', response.data);
  } catch (error) {
    console.error(error);
  } finally {
    setEmailLoading(false);
  }
}, [debouncedEmail]);

   useEffect(() => {
     checkEmail().catch(console.error);
   }, [debouncedEmail]);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.toLowerCase().replace(/\s/g, '');
    setUsernameLoading(true);
    setUsername(value);
    sleep(1000)
      .then(() => {
        checkUsername(value).catch(console.error);
      })
      .catch(console.error);
  };

  const handleChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setEmail(val);
    setData([]);

    if (val.trim().length === 0 || val.includes('@')) {
      setLoading(false);
      setEmailLoading(false);
    } else {
      setLoading(true);
      setEmailLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);
        setData(
          ['gmail.com', 'outlook.com', 'yahoo.com'].map(
            (provider) => `${val}@${provider}`,
          ),
        );
        // checkEmail().catch(console.error);
      }, 1000);
    }
  };

  return (
    <Center className="h-[80dvh]">
      <Card shadow="md" radius="md" withBorder className="w-[50vw]">
        <Text>Enter your details to get started</Text>
        <TextInput
          value={username}
          onChange={handleUsernameChange}
          label="Username"
          withAsterisk
          placeholder="Enter your username"
        />

        <Flex>
          {usernameLoading ? <Loader m="xs" size="xs" /> : null}
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
          withAsterisk
          label="Name"
          placeholder="Enter your name"
          my="sm"
        />
        <Autocomplete
          value={email}
          onChange={handleChange}
          label="Email"
          withAsterisk
          placeholder="Enter your email"
          data={data}
          my="sm"
          disabled={emailLocked}
          leftSection={emailLocked ? <IconLock size={16} /> : null}
        />
        <Stack>
          {emailLoading ? <Loader m="xs" size="xs" /> : null}
          {!emailLoading &&
            debouncedEmail.length > 0 &&
            (emailExists && debouncedEmail.length > 0 ? (
              <>
                <Text c="red">Email already exists </Text>
                <Text c="blue">Associated Wallet: {walletAddress}</Text>
              </>
            ) : (
              <Text c="green">{email} Is a Valid Email </Text>
            ))}
        </Stack>
        <Button
          onClick={handleLogin}
          loading={loading || uploadUserMutation.isLoading}
          disabled={
            loading ||
            uploadUserMutation.isLoading ||
            exists ||
            emailExists ||
            usernameLoading ||
            emailLoading
          }
          color="blue"
          fullWidth
          my="sm"
        >
          Get Started
        </Button>
        <Button
          onClick={logout}
          loading={logoutLoading}
          disabled={
            loading ||
            uploadUserMutation.isLoading ||
            exists ||
            emailExists ||
            usernameLoading ||
            emailLoading
          }
          color="blue"
          fullWidth
          my="sm"
        >
          Exit (Logout)
        </Button>
      </Card>
    </Center>
  );
}
