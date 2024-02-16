import { ActionIcon, Kbd, rem } from '@mantine/core';
import type { SpotlightActionData } from '@mantine/spotlight';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconHome, IconSearch } from '@tabler/icons-react';
import { BiSolidDonateHeart } from 'react-icons/bi';
import { FaDonate } from 'react-icons/fa';
import { FcAbout } from 'react-icons/fc';

const actions: SpotlightActionData[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Get to home page',
    onClick: () => {
      window.location.href = '/';
    },
    leftSection: <IconHome style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
  },
  {
    id: 'portals',
    label: 'portals',
    description: 'Create or Contribue to portals',
    onClick: () => {
      window.location.href = '/portal/explore';
    },
    leftSection: <BiSolidDonateHeart style={{ width: rem(24), height: rem(24) }} />,
  },
  {
    id: 'about-portals',
    label: 'About Portals',
    description: 'Learn more about portals',
    onClick: () => {
      window.location.href = '/portal/about';
    },
    leftSection: <FcAbout style={{ width: rem(24), height: rem(24) }} />,
  },
  {
    id: 'Prizes',
    label: 'Prizes',
    description: 'Create or Contribute to Prizes',
    onClick: () => {
      window.location.href = '/prize/explore';
    },
    leftSection: <FaDonate style={{ width: rem(24), height: rem(24) }} />,
  },
  {
    id: 'about-prizes',
    label: 'About Prizes',
    description: 'Learn more about Prizes',
    onClick: () => {
      window.location.href = '/prize/about';
    },
    leftSection: <FcAbout style={{ width: rem(24), height: rem(24) }} />,
  },
];

export default function SpotlightSearch() {
  return (
    <>
      {/* <Button onClick={() => void spotlight.open()}>Open spotlight</Button> */}
      {/* <Input
        placeholder="Search"
        leftSection={<CiSearch size={16} />}
        rightSection={<Kbd>⌘+k</Kbd>}
        onClick={() => void spotlight.open()}
      /> */}
      <div className='flex gap-2 items-center'>
        <ActionIcon color="transparent" onClick={() => void spotlight.open()}>
          <IconSearch />
        </ActionIcon>
        {/* <Kbd>⌘+k</Kbd> */}
      </div>
      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: (
            <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          ),
          placeholder: 'Search...',
        }}
      />
    </>
  );
}
