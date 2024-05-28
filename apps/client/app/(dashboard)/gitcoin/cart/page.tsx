import { Divider, Text } from '@mantine/core';
import AddedProjects from './added-projects';
import SummaryCard from './summary-card';

export default function CartPage() {
  return (
    <div className="max-w-screen-xl w-screen">
      <h2>Cart</h2>
      <Divider my="md" />
      <h3>Hypercerts Ecosystem Round</h3>
      <div className="w-full lg:flex space-y-3 lg:gap-4 justify-between">
        <AddedProjects />
        <SummaryCard />
      </div>
    </div>
  );
}
