'use client';
import { renderToPlainText } from '@/lib/utils';
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Divider,
  NumberInput,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { CartItem, useCartStore } from '../../../(_utils)/store/datastore';
import { useState } from 'react';

export default function AddedProjects() {
  const { items, removeItem, clearCart, changeAmount } = useCartStore();
  const [error, setError] = useState('');

  const handleAmountChange = (item: CartItem, value: number) => {
    if (value < 1.5) {
      setError('Donation amount must be at least $1.5 USD.');
    } else {
      setError('');
      changeAmount(item.id, value);
    }
  };

  return (
    <Card padding="lg" radius="lg" withBorder className="w-full">
      {items.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <div>
          {items.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-center gap-4 justify-between my-2">
                <Avatar
                  alt="Image"
                  radius="xl"
                  size="lg"
                  src={`https://ipfs.io/ipfs/${item.project.metadata.bannerImg}`}
                />
                <div className="mt-3">
                  <Text fw="bold" size="lg">
                    {item.project.metadata.title}
                  </Text>
                  <p className="text-md hidden lg:visible lg:block">
                    {renderToPlainText(item.project.metadata.description).substring(
                      0,
                      130,
                    )}
                    ...
                  </p>
                </div>
                <div className="flex items-center justify-center w-full lg:w-1/3">
                  <NumberInput
                    placeholder="10"
                    min={0}
                    value={item.amount}
                    onChange={(value) => handleAmountChange(item, value as number)}
                    className="w-full"
                  />
                  <Text fw="bold" ml="sm">
                    USD
                  </Text>
                </div>
                <ActionIcon
                  variant="light"
                  p="3px"
                  color="red"
                  onClick={() => removeItem(item.id)}
                >
                  <IconTrash color="red" />
                </ActionIcon>
              </div>
              <Divider />
            </div>
          ))}
          {error && <Text color="red">{error}</Text>}
          <Button color="red" fullWidth mt="md" radius="md" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      )}
    </Card>
  );
}
