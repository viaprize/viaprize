import { Select, Title } from '@mantine/core';
import { useState } from 'react';
import useAuthPerson from '../hooks/useAuthPerson';
import AllPortals from './all-portals';
import PortalProposalsTabs from './portal-proposals-tabs';

const authSelect = [
  { label: 'Portals', value: 'all-portals' },
  { label: 'Proposals', value: 'all-proposals' },
];

const select = [{ label: 'Portals', value: 'all-portals' }];

export default function PortalTabs({ params }: { params: { id: string } }) {
  const [value, setValue] = useState('all-portals');
  const isProfileOwner = useAuthPerson();

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <Title className="text-lg md:text-2xl">Portals</Title>
        <Select
          value={value}
          data={isProfileOwner ? authSelect : select}
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
        {value === 'all-proposals' && isProfileOwner ? (
          <PortalProposalsTabs params={params} />
        ) : null}
      </div>
    </div>
  );
}
