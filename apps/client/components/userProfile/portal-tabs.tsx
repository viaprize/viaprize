import { Select, Title } from '@mantine/core';
import { useState } from 'react';
import PrizeTabs from './all-prize-tabs';
import PortalProposalsTabs from './portal-proposals-tabs';

export default function PortalTabs({ params }: { params: { id: string } }) {
  const [value, setValue] = useState('all-prizes');

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <Title className="text-2xl">Portals</Title>
        <Select
          value={value}
          data={[
            { label: 'Portals', value: 'all-portals' },
            { label: 'Proposals', value: 'all-proposals' },
          ]}
          defaultValue="all-prizes"
          allowDeselect={false}
          onChange={(val) => {
            if (val) {
              setValue(val);
            }
          }}
        />
      </div>
      <div className="mt-2">
        {value === 'all-prizes' && <PrizeTabs params={params} />}
        {value === 'all-proposals' && <PortalProposalsTabs params={params} />}
      </div>
    </div>
  );
}
