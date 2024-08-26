'use client';

import { Button, Group, Image, Title } from '@mantine/core';
import { useCartStore } from 'app/(dashboard)/(_utils)/store/datastore';
import { useRouter } from 'next/navigation';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { toast } from 'sonner';
import type { Application } from 'types/gitcoin.types';

export default function ImageTitleCard({
  applicationID,
  title,
  img,
  logoURL,
  exploreUrl,
  application,
  roundId,
  chainId,
  roundSlug,
}: {
  applicationID: string;
  title: string;
  img: string;
  exploreUrl: string;
  logoURL: string;
  roundId: string;
  chainId: number;
  roundSlug: string;
  application: Application;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartItems = useCartStore((state) => state.items);
  const checkIsItemInCart = (itemID: string) =>
    cartItems.some((item) => item.id === itemID);

  const isCartItem = checkIsItemInCart(applicationID);

  const router = useRouter();

  const handleAddToCart = () => {
    if (!roundId) {
      throw Error('Round not defined');
    }
    if (!isCartItem) {
      addItem({
        ...application,
        roundId,
        chainId: chainId.toString(),
        amount: '0',
      });
      toast.success(`${title} added to cart`, {
        action: {
          label: 'View Cart',
          onClick: () => {
            router.push(`/qf/${roundSlug}/cart`);
          },
        },
      });
    }
  };

  const handleRemoveFromCart = () => {
    if (isCartItem) {
      removeItem(applicationID);
      toast.warning(`${title} removed from cart`);
    }
  };

  return (
    <div className="max-h-fit  h-full p-0 space-y-3 relative">
      <Group >
        <Button
          component="a"
          href={exploreUrl}
          leftSection={<FaLongArrowAltLeft className="mr-2" />}
        >
          <span className="w-full min-w-fit">Go to explore page</span>
        </Button>
        <Button
          color={isCartItem ? 'red' : 'primary'}
          component="a"
          radius="md"
          onClick={(e) => {
            e.stopPropagation();
            isCartItem ? handleRemoveFromCart() : handleAddToCart();
          }}
        >
          {isCartItem ? 'Remove from Cart' : 'Add to Cart'}
        </Button>
      </Group>
      <div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center">
        <Title className="sm:text-1xl md:3xl lg:text-5xl">{title}</Title>
      </div>
      <Image
        src={img}
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/150';
        }}
        alt="Fundraisers Image"
        className="h-full w-full object-cover rounded-xl"
      />
      <Image
        src={logoURL}
        className="rounded-full w-[60px] h-[60px] lg:w-[140px] lg:h-[140px] absolute left-4 bottom-[-35px]"
      />
    </div>
  );
}
