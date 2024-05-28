'use client';
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Divider,
  NumberInput,
  Text,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useCartStore } from '../../(_config)/store/datastore';

export default function AddedProjects() {
  const { items, removeItem, clearCart } = useCartStore();

  return (
    <Card padding="lg" radius="lg" withBorder className="bg-gray-100 w-full">
      {items.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <div>
          {items.map((item) => (
            <>
              <div key={item.id} className="flex items-center justify-between">
                <Avatar alt="Image" radius="xl" size="lg" src={item.imageURL} />

                <div className="mt-3">
                  <Text fw="bold" size="lg">
                    {item.title}
                  </Text>
                  <Text className="text-md h-20 overflow-y-auto">{item.description}</Text>
                </div>
                <div className="flex items-center">
                  <NumberInput placeholder="Enter the value" prefix="$" mb="md" />
                  <Text fw="bold" ml="sm" mb="sm">
                    USD
                  </Text>
                </div>
                <ActionIcon variant="default" onClick={() => removeItem(item.id)}>
                  <IconTrash />
                </ActionIcon>
              </div>
              <Divider />
            </>
          ))}
          <Button color="red" fullWidth mt="md" radius="md" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      )}
    </Card>
  );
}
