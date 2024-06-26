import { Accordion, Button, Divider, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const navbnarItems = [
  {
    label: 'Prizes',
    hrefabout: '/prize/about',
    hrefexplore: '/prize/explore',
    about: 'About Prizes',
    explore: 'Explore Prizes',
    hrefcreate: '/prize/create',
    createbutton: 'Create Prize',
    description:
      'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
  {
    label: 'Fundraisers',
    hrefabout: '/portal/about',
    hrefexplore: '/portal/explore',
    explore: 'Explore Fundraisers',
    about: 'About Fundraisers',
    hrefcreate: '/portal/create',
    createbutton: 'Create Fundraisers',
    description:
      'em ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
];

export default function MobileNavbar({
  close,
  open,
}: {
  close: () => void;
  open: boolean;
}) {
  const pathName = usePathname();

  useEffect(() => {
    if (open) {
      close();
    }
  }, [pathName]);

  const items = navbnarItems.map((item) => (
    <Accordion.Item key={item.label} value={item.label}>
      <Accordion.Control>
        <Text className="font-bold">{item.label}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap="md">
          <Link href={item.hrefabout} className="hover:text-blue-400">
            <Text>About</Text>
          </Link>
          <Link href={item.hrefexplore} className="hover:text-blue-400">
            {item.explore}
          </Link>

          <Button>
            <Link href={item.hrefcreate}>{item.createbutton}</Link>
          </Button>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <div className="flex ">
      <Stack gap="lg" className="my-7 ml-4 w-full">
        <Link href="/" className=" font-bold hover:underline flex justify-between pl-4">
          Home
        </Link>
        <Divider />
        <Accordion>{items}</Accordion>
      </Stack>
    </div>
  );
}
