import useAppUser from '@/context/hooks/useAppUser';
import { Avatar, Badge, Box, Button, Group, Text } from '@mantine/core';
import {
  IconBrandGithubFilled,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandX,
} from '@tabler/icons-react';

export default function Profile() {
  // const { address } = useAccount();
  const { appUser } = useAppUser()
  // const { data, isLoading, refetch } = useBalance({ address });
  return (
    <div className="p-8 md:w-1/3">
      <div>
        <Avatar radius="full" size="xl" />
        <Text fw={700} size="xl" className="mb-0 uppercase mt-4">
          {appUser?.name}
        </Text>
        <Text className="lg my-0">@{appUser?.username}</Text>
        <Group>
          {/* <div>
        <span   className='mr-1 font-bold' >
            200
        </span> 
        <span>
        Followers
        </span>
      </div>
       <Text fw={200}   className='flex flex-cols'>
        <Text fw={500}  className='mr-1 ml-6'>
            200
        </Text> 
        Following
      </Text> */}
        </Group>
        <Group mt="sm">
          <Avatar radius="xl" size="sm">
            <IconBrandX />
          </Avatar>
          <Avatar radius="xl" size="sm">
            <IconBrandLinkedin />
          </Avatar>
          <Avatar radius="xl" size="sm">
            <IconBrandGithubFilled />
          </Avatar>
          <Avatar radius="xl" size="sm">
            <IconBrandTelegram />
          </Avatar>
        </Group>
        <Button my="sm">Edit Profile</Button>
      </div>

      <div>
        <h1 className="mb-0 text-xl font-bold">Bio</h1>
        <p className="my-0">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
        </p>
        {/* <div className="flex gap-3 justify-between">
          <div>
              <div className='flex gap-3 items-center'>
              {isLoading ? (
                <Loader color="blue" />
              ) : (
                <Text w={500} c="green" size="xl">
                  {data?.formatted} Eth
                </Text>
              )}
              <ActionIcon>
              <IconRefresh onClick={() => refetch()} />
            </ActionIcon>
            </div>
            <Text w={600} c="" size="lg">
              Balance In Eth 
            </Text>   
          </div>
        </div> */}
      </div>

      <Box mt="md">
        <Text fw={700} mb="sm" mt="md" className="pl-1">
          Skills
        </Text>
        <div className="flex flex-wrap gap-1">
          <Badge variant="light" color="green">
            FULL STACK DEVELOPER
          </Badge>
          <Badge variant="light" color="green">
            SMART CONTRACT DEVELOPER
          </Badge>
          <Badge variant="light" color="green">
            Indigo cyan
          </Badge>
        </div>

        <Text fw={700} mb="sm" mt="md" className="pl-1">
          Values
        </Text>
        <div className="flex flex-wrap gap-1">
          <Badge variant="light" color="green">
            FULL STACK DEVELOPER
          </Badge>
          <Badge variant="light" color="green">
            SMART CONTRACT DEVELOPER
          </Badge>
          <Badge variant="light" color="green">
            Indigo cyan
          </Badge>
        </div>
      </Box>
    </div>
  );
}
