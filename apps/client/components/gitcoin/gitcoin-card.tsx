'use client';

import { gitcoinRoundData } from '@/lib/constants';
import { renderToPlainText } from '@/lib/utils';
import {
  ActionIcon,
  Avatar,
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
import Link from 'next/link';
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
  logoURL: string;
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
  logoURL
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
        roundId: gitcoinRoundData.roundId,
        chainId: gitcoinRoundData.chainId.toString(),
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
      // component="a"
      // href={link}
    >
      <Link href={link}>
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
      </Link>
      <Link href={link} className="mt-4 flex justify-between items-center">
        <div className="">
          {title.length > 35 ? (
            <Text fw="bold" size="lg">
              {title.substring(0, 35)}...
            </Text>
          ) : (
            <Text fw="bold" size="lg">
              {title}
            </Text>
          )}
        </div>
        <Image
          alt="Logo"
          height={70}
          width={70}
          src={
            logoURL ||
            'https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image'
          }
          className="rounded-full absolute  right-4"
        />
      </Link>
      <Link href={link}>
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
        </div>
      </Link>
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

      <div className="absolute top-2 right-2">
        <CopyButton value={`https://www.viaprize.org/qf/opencivics/${link}`}>
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
