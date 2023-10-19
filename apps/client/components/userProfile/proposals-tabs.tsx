import React from "react";
import ExploreCard from "../ExplorePrize/explorePrize";
import { Button, Box, Group, Menu, SimpleGrid, Text } from "@mantine/core";
import {
  IconSettings,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconArrowsLeftRight,
  IconTrash,
} from "@tabler/icons-react";

export default function ProposalsTabs() {
  return (
    <Box p="md">
      <Group position="apart" px="md">
        <Text weight={600} size="lg">
          Submitted Proposals
        </Text>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button>All Categories</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item icon={<IconMessageCircle size={14} />}>
              Messages
            </Menu.Item>
            <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
            <Menu.Item icon={<IconSearch size={14} />}>Search</Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item icon={<IconArrowsLeftRight size={14} />}>
              Transfer my data
            </Menu.Item>
            <Menu.Item color="red" icon={<IconTrash size={14} />}>
              Delete my account
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <SimpleGrid cols={3} my="md">
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
          money="$500"
          deadline="yourDeadline"
        />
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
          money="$500"
          deadline="yourDeadline"
        />
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
          money="$500"
          deadline="yourDeadline"
        />
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
          money="$500"
          deadline="yourDeadline"
        />
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
          money="$500"
          deadline="yourDeadline"
        />
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
          money="$500"
          deadline="yourDeadline"
        />
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
          money="$500"
          deadline="yourDeadline"
        />
      </SimpleGrid>
    </Box>
  );
}
