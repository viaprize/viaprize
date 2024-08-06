'use client';
import { Button, Divider } from '@mantine/core';
import AddedProjects from './added-projects';
import SummaryCard from './summary-card';
export type CartAmountItem = {
  amount: number;
};
export type CartItemToAcount = { [key: string]: number };

export default function CartPage() {
  return (
    <div className="max-w-screen-xl w-screen">
      <div className="flex items-center space-x-5">
        <h2>Cart</h2>
        <Button component="a" href="/qf/opencivics/explore">
          Go to explore page
        </Button>
      </div>
      <Divider my="md" />
      <h3>Hypercerts Ecosystem Round</h3>
      <div className="text-md mb-3">
        Your donation to each project must be valued at 2 USD or more to be eligible for
        matching.
      </div>
      <div className="w-full lg:flex space-y-3 mb-4 lg:gap-4 justify-between">
        <AddedProjects />
        <SummaryCard />
      </div>
    </div>
  );
}
