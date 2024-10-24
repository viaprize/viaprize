'use client';
import { renderToPlainText } from '@/lib/utils';
import { ActionIcon, Avatar, Button, Card, Divider, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { type CartItem, useCartStore } from 'app/(dashboard)/(_utils)/store/datastore';
import { useState } from 'react';

export default function AddedProjects({
  roundId,
  minDonationPerProject,
}: {
  roundId: string;
  minDonationPerProject:number
}) {
  const { items, removeItem, clearCart, changeAmount } = useCartStore();
  const [error, setError] = useState('');
  const filteredItems = items.filter((item) => item.roundId === roundId);
  const handleAmountChange = (item: CartItem, value: number) => {
    const amount = isNaN(value) ? 0 : value;
    changeAmount(item.id, amount);

    if (amount < minDonationPerProject) {
      setError(
        `Donation amount for ${item.project.metadata.title} must be at least ${minDonationPerProject} USD.`,
      );
    } else {
      setError('');
    }
  };

  return (
    <Card padding="lg" radius="lg" withBorder className="w-full">
      {filteredItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <div>
          {filteredItems.map((item, index) => (
            <div key={item.id}>
              <div className="lg:flex lg:items-center gap-1 lg:gap-3 justify-between my-2">
                <div className="flex mb-2 lg:mb-0 items-center space-x-2">
                  <Avatar
                    alt="Image"
                    radius="xl"
                    size="lg"
                    src={`https://gitcoin.mypinata.cloud/ipfs/${item.project.metadata.bannerImg}`}
                  />
                  <div className="mt-3">
                    <Text fw="bold" size="lg" className="lg:block">
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
                </div>
                <div className="flex items-center space-x-3 justify-center w-full lg:w-1/3">
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
                  <Text fw="bold">USD</Text>

                  <ActionIcon
                    variant="light"
                    p="3px"
                    color="red"
                    onClick={() => removeItem(item.id)}
                  >
                    <IconTrash color="red" />
                  </ActionIcon>
                </div>
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
