'use client';

import { renderToPlainText } from '@/lib/utils';
import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Divider,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

import { useCartStore } from 'app/(dashboard)/(_utils)/store/datastore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Application } from 'types/gitcoin.types';
export interface CartItem {
  id: string;
  imageURL: string;
  title: string;
  description: string;
  raised: number;
  contributors: number;
  link: string;
  application: Application;
}

export default function GitcoinCard({
  id,
  imageURL,
  title,
  description,
  raised,
  contributors,
  link,
  application,
}: CartItem) {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartItems = useCartStore((state) => state.items);
  const router = useRouter();
  const isItemInCart = (itemID: string) => cartItems.some((item) => item.id === itemID);

  // const tokens = getTokensByChainId(8453);

  // console.log(tokens, 'tokens');

  const handleAddToCart = () => {
    if (!isItemInCart(id)) {
      addItem({
        ...application,
        roundId: '31',
        chainId: '8453',
        amount: '0',
      });
      toast.success(`${title} added to cart`);
    }
  };

  const handleRemoveFromCart = () => {
    if (isItemInCart(id)) {
      removeItem(id);
      toast.success(`${title} removed from cart`);
    }
  };

  return (
    <Card
      padding="lg"
      radius="lg"
      withBorder
      className="shadow-sm hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
      pos="relative"
      onClick={() => router.push(link)}
    >
      <Card.Section>
        <Image
          alt="Image"
          height={160}
          width={420}
          src={
            imageURL ||
            'https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image'
          }
        />
      </Card.Section>
      <div className="flex flex-col justify-between h-full">
        {title.length > 35 ? (
          <Text fw="bold" size="lg">
            {title.substring(0, 35)}...
          </Text>
        ) : (
          <Text fw="bold" size="lg">
            {title}
          </Text>
        )}

        <div>
          <p className="text-md h-20 overflow-y-auto overflow-x-hidden">
            {renderToPlainText(description).substring(0, 130)}...
          </p>
          <Divider className="mt-2" />
          <Text fw="bold" size="xl">
            ${raised}
          </Text>
          <Text size="sm">
            Total raised by <span className="text-gray font-bold">{contributors}</span>{' '}
            contributors
          </Text>
          <Button
            color={isItemInCart(id) ? 'red' : 'primary'}
            component="a"
            fullWidth
            mt="md"
            radius="md"
            onClick={(e) => {
              e.stopPropagation();
              isItemInCart(id) ? handleRemoveFromCart() : handleAddToCart();
            }}
          >
            {isItemInCart(id) ? 'Remove from Cart' : 'Add to Cart'}
          </Button>
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <CopyButton value={`https://www.viaprize.org/portal/${link}`}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Share URL'} withArrow>
              <ActionIcon
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  copy();
                }}
                color={copied ? 'teal' : 'primary'}
              >
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
    </Card>
  );
}
