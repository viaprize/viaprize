'use client';

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { useUser } from '../hooks/useUser';
import AuthWrap from './auth-wrapper';
import SendCard from './donation-card';
import EditProfileModal from './edit-profile-modal';

export default function Profile({ params }: { params: { id: string } }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { getUserByUserName } = useUser();
  // const params = useParams<{ id: string }>();

  const { data: userData, refetch: fetchUser } = useQuery(
    'getUserByUserName',
    () => getUserByUserName(params?.id || ''),
    {
      onError: (error) => {
        console.error(error);
      },
    },
  );
  console.log(userData, 'user data');

  return (
    <Card
      shadow="md"
      className="w-full min-w-0 flex flex-col md:flex-row justify-center gap-3"
    >
      <div className="md:p-8 p-3">
        <div>
          <Avatar radius="full" size="xl" src={userData?.avatar} />
          <Text fw={700} size="xl" className="mb-0 uppercase mt-4">
            {userData?.name}
          </Text>
          <Group justify="space-between">
            <Text className="lg my-0">@{params?.id}</Text>
            <AuthWrap>
              <Button size="xs" onClick={open}>
                Edit Profile
              </Button>
              <Modal opened={opened} onClose={close} title="Edit Profile">
                <EditProfileModal
                  IBio={userData?.bio || ''}
                  IName={userData?.name || ''}
                  IProficiencies={userData?.proficiencies || []}
                  IPriorities={userData?.priorities || []}
                  IAvatar={userData?.avatar || ''}
                  fetchUser={fetchUser}
                  closeModal={close}
                />
              </Modal>
            </AuthWrap>
          </Group>
        </div>

        <div>
          <h1 className="mb-0 text-xl font-bold">Bio</h1>
          <p className="my-0">{userData?.bio}</p>
        </div>

        <Box mt="md">
          <Text fw={700} mb="sm" mt="md" className="pl-1">
            Proficiencies
          </Text>
          <div className="flex flex-wrap gap-1">
            {userData?.proficiencies.map((proficiency: string) => (
              <Badge key={proficiency} variant="light" color="green">
                {proficiency}
              </Badge>
            ))}
          </div>

          <Text fw={700} mb="sm" mt="md" className="pl-1">
            Priorities
          </Text>
          <div className="flex flex-wrap gap-1">
            {userData?.priorities.map((priority: string) => (
              <Badge key={priority} variant="light" color="blue">
                {priority}
              </Badge>
            ))}
          </div>
        </Box>
      </div>
      {params?.id === userData?.username && (
        <>
          <Divider orientation="vertical" className="hidden md:block" />
          <SendCard />
        </>
      )}
    </Card>
  );
}
