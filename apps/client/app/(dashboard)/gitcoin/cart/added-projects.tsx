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
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useCartStore } from '../../(_utils)/store/datastore';

export default function AddedProjects() {
  const { items, removeItem, clearCart, changeAmount } = useCartStore();
  console.log({ items });
  return (
    <Card padding="lg" radius="lg" withBorder className=" w-full">
      {items.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <div>
          {items.map((item, index) => (
            <>
              <div key={item.id} className="flex items-center gap-4 justify-between">
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
                  <p className="text-md ">
                    {renderToPlainText(item.project.metadata.description).substring(
                      0,
                      130,
                    )}
                    ...
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <NumberInput
                    placeholder="10"
                    min={0}
                    value={parseFloat(item.amount)}
                    onChange={(value) => {
                      console.log({ value });
                      changeAmount(item.id, parseFloat(value.toString()));
                    }}
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
