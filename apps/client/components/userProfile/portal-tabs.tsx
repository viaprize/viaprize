import { Select, Title } from '@mantine/core';
import { useState } from 'react';
import AllPortals from './all-portals';
import PortalProposalsTabs from './portal-proposals-tabs';

export default function PortalTabs({ params }: { params: { id: string } }) {
  const [value, setValue] = useState('all-portals');

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <Title className="text-lg md:text-2xl">Portals</Title>
        <Select
          value={value}
          data={[
            { label: 'Portals', value: 'all-portals' },
            { label: 'Proposals', value: 'all-proposals' },
          ]}
          defaultValue="all-portals"
          allowDeselect={false}
          onChange={(val) => {
            if (val) {
              setValue(val);
            }
          }}
        />
      </div>
      <div className="mt-2">
        {value === 'all-portals' && <AllPortals params={params} />}
        {value === 'all-proposals' && <PortalProposalsTabs params={params} />}
      </div>
    </div>
  );
}
