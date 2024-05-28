'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CopyButton,
  Divider,
  Group,
  Image,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import type { CartItem } from 'app/(dashboard)/(_config)/store/datastore';
import { useCartStore } from 'app/(dashboard)/(_config)/store/datastore';
import { toast } from 'sonner';

// interface GitcoinCardProps {
//   id: string;
//   imageURL: string;
//   title: string;
//   by: string;
//   description: string;
//   raised: number;
//   contributors: number;
//   link: string;
// }

export default function GitcoinCard({
  id,
  imageURL,
  by,
  title,
  description,
  raised,
  contributors,
  link,
}: CartItem) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const isItemInCart = (itemID: string) => cartItems.some((item) => item.id === itemID);

  const handleAddToCart = () => {
    if (!isItemInCart(id)) {
      addItem({ id, imageURL, by, title, description, raised, contributors, link });
      toast.success(`${title} added to cart`);
    }
  };

  return (
    <Card
      padding="lg"
      radius="lg"
      withBorder
      className="shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
      pos="relative"
    >
      <Card.Section>
        <Image alt="Image" height={160} src={imageURL} />
      </Card.Section>

      <Group mt="sm" justify="space-between">
        <Text fw="bold" size="lg">
          {title}
        </Text>
        <Badge color="blue" variant="light" p="sm">
          {by}
        </Badge>
      </Group>

      <p className="text-md h-20 overflow-y-auto">{description}</p>
      <Divider className="mt-2" />
      <Text fw="bold" size="xl">
        ${raised}
      </Text>
      <Text size="sm">
        Total raised by <span className="text-gray font-bold">{contributors}</span>{' '}
        contributors
      </Text>

      <Button
        color="primary"
        component="a"
        fullWidth
        mt="md"
        radius="md"
        onClick={handleAddToCart}
        disabled={isItemInCart(id)}
      >
        {isItemInCart(id) ? 'Added to Cart' : 'Add to Cart'}
      </Button>

      <div className="absolute top-2 right-2">
        <CopyButton value={`https://www.viaprize.org/portal/${link}`}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Share URL'} withArrow>
              <ActionIcon size="lg" onClick={copy} color={copied ? 'teal' : 'primary'}>
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
    </Card>
  );
}
