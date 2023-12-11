import useAppUser from '@/context/hooks/useAppUser';
import {
  Accordion,
  Button,
  Divider,
  Flex,
  Group,
  Menu,
  MenuTarget,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';

const navbnarItems = [
  {
    label: 'Prizes',
    hrefexplore: '/prize/explore',
    about: 'About Prizes',
    explore: 'Explore Prizes',
    hrefcreate: '/prize/create',
    createbutton: 'Create Prize',
    description:
      'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
  {
    label: 'Portals',
    hrefexplore: '/portal/explore',
    explore: 'Explore Portals',
    about: 'About Portals',
    hrefcreate: '/portal/create',
    createbutton: 'Create Portal',
    description:
      'em ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
];

export default function MobileNavbar() {
  const { appUser } = useAppUser();

  const items = navbnarItems.map((item) => (
    <Accordion.Item key={item.label} value={item.label}>
      <Accordion.Control>
        <Text className="font-bold">{item.label}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Flex justify="space-between">
          <Text>About</Text>
          <Link href={item.hrefexplore} className="underline">
            {item.explore}
          </Link>
        </Flex>

        <p>{item.description}</p>
        <Button>
          <Link href={item.hrefcreate}>{item.createbutton}</Link>
        </Button>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <div className="flex ">
      <Stack gap="lg" className="my-7 ml-4 w-full">
        <Link href="/" className=" font-bold hover:underline flex justify-between pl-4">
          Home
        </Link>
        <Accordion>{items}</Accordion>
      </Stack>
    </div>
  );
}
