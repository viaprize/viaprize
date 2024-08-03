'use client';
import { renderToPlainText } from '@/lib/utils';
import { ActionIcon, Avatar, Button, Card, Divider, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { CartItem, useCartStore } from '../../../(_utils)/store/datastore';

export default function AddedProjects() {
  const { items, removeItem, clearCart, changeAmount } = useCartStore();
  const [error, setError] = useState('');

  const handleAmountChange = (item: CartItem, value: number) => {
    changeAmount(item.id, value);

    const totalAmount = items.reduce((acc, currentItem) => {
      if (currentItem.id === item.id) {
        return acc + value;
      }
      return acc + parseFloat(currentItem.amount);
    }, 0);

    // if (items.length === 1 && value < 2 && Number.isNaN(value)) {
    //   setError('Donation amount must be at least $2 USD.');
    // }

    // else if (totalAmount < 2 ) {
    //   setError('Total donation amount must be at least $2 USD.');
    // } else {
    //   setError('');
    // }
  };

  return (
    <Card padding="lg" radius="lg" withBorder className="w-full">
      {items.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <div>
          {items.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-center gap-1 lg:gap-3 justify-between my-2">
                <Avatar
                  alt="Image"
                  radius="xl"
                  size="lg"
                  src={`https://ipfs.io/ipfs/${item.project.metadata.bannerImg}`}
                />
                <div className="mt-3">
                  <Text fw="bold" size="lg" className="lg:block">
                    {item.project.metadata.title}
                  </Text>
                  {/* <Text fw="bold" size="lg" className="lg:hidden">
                    {item.project.metadata.title.substring(0, 6)}...
                  </Text> */}
                  <p className="text-md hidden lg:visible lg:block">
                    {renderToPlainText(item.project.metadata.description).substring(
                      0,
                      130,
                    )}
                    ...
                  </p>
                </div>
                <div className="flex items-center justify-center w-full lg:w-1/3">
                  <input
                    type="number"
                    id="number-input"
                    value={item.amount}
                    onChange={(e) => handleAmountChange(item, parseFloat(e.target.value))}
                    aria-describedby="helper-text-explanation"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="10"
                    min={0}
                    required
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
          {error && <Text c="red">{error}</Text>}
          <Button color="red" fullWidth mt="md" radius="md" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      )}
    </Card>
  );
}
