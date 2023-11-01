import { PrizeProposals } from '@/lib/api';
import { ProposalStatus } from '@/lib/types';
import { Box, Button, Group, Menu, SimpleGrid, Text } from '@mantine/core';
import {
  IconArrowsLeftRight,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconTrash,
} from '@tabler/icons-react';
import ProposalExploreCard from '../ExplorePrize/proposalExploreCard';

export default function ProposalsTabs({
  data,
  isSuccess,
}: {
  data?: PrizeProposals[];
  isSuccess: boolean;
}) {
  const getProposalStatus = (item: PrizeProposals): ProposalStatus => {
    if (data) {
      if (item.isApproved) {
        return 'approved';
      } else if (item.isRejected) {
        return `rejected`;
      }
      return 'pending';
    }
    return 'pending';
  };
  return (
    <Box p="md">
      <Group justify="space-between" px="md">
        <Text w={600} size="lg">
          Submitted Proposals
        </Text>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button>All Categories</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item leftSection={<IconMessageCircle size={14} />}>Messages</Menu.Item>
            <Menu.Item leftSection={<IconPhoto size={14} />}>Gallery</Menu.Item>
            <Menu.Item leftSection={<IconSearch size={14} />}>Search</Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item leftSection={<IconArrowsLeftRight size={14} />}>
              Transfer my data
            </Menu.Item>
            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
              Delete my account
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <SimpleGrid cols={3} my="md">
        {isSuccess ? (
          data?.map((item) => (
            <ProposalExploreCard
              status={getProposalStatus(item)}
              key={item.id}
              imageUrl={item.images[0]}
              description={item.description}
              onStatusClick={(status) => {
                switch (status) {
                  case 'pending':
                    console.log('pending');
                    break;
                  case 'approved':
                    console.log('approved');
                    break;
                  case 'rejected':
                    console.log('rejected');
                    break;
                  default:
                    break;
                }
              }}
              profileName={item.user.username}
              title={item.title}
            />
          ))
        ) : (
          <Text>No Proposals</Text>
        )}
      </SimpleGrid>
    </Box>
  );
}
