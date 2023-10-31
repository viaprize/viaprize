import { Avatar, Badge, Box, Button, Group, Stack, Text } from '@mantine/core';
import {
  IconBrandGithubFilled,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandX,
} from '@tabler/icons-react';

export default function Profile() {
  return (
    <div>
      <Box my="sm">
        <Avatar radius="xl" size="xl" />

        <Text size="xl">ARYAN TIWARI</Text>
        <Text className="lg">@arrytiwari</Text>
        {/* <Group>
      <Text weight={200} className='flex flex-cols '>
        <Text weight={500}  className='mr-1' >
            200
        </Text> 
        Followers
      </Text>
       <Text weight={200}   className='flex flex-cols'>
        <Text weight={500}  className='mr-1 ml-6'>
            200
        </Text> 
        Following
      </Text>
      </Group> */}
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
        <Button fullWidth my="sm">
          Edit Profile
        </Button>
      </Box>

      <Box>
        <Text w={600}>Description</Text>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
        </Text>
        <Group mt="md">
          <Stack>
            <Text w={300} color="" size="lg">
              Projects :
              <Text w={500} color="orange" size="xl">
                200
              </Text>
            </Text>
          </Stack>
          <Stack>
            <Text w={300} color="" size="lg">
              Contributions :
              <Text w={500} color="green" size="xl">
                200
              </Text>
            </Text>
          </Stack>
        </Group>
      </Box>
      <Box mt="md">
        <Text>Skills</Text>
        <div>
          <Badge color="green">FULL STACK DEVELOPER</Badge>
          <Badge color="green">SMART CONTRACT DEVELOPER</Badge>
          <Badge color="green">Indigo cyan</Badge>
        </div>

        <Text mt="md">Values</Text>
        <div>
          <Badge color="green">FULL STACK DEVELOPER</Badge>
          <Badge color="green">SMART CONTRACT DEVELOPER</Badge>
          <Badge color="green">Indigo cyan</Badge>
        </div>
      </Box>
    </div>
  );
}
