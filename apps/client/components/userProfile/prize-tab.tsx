import { Select, Title } from '@mantine/core';
import { useState } from 'react';
import PrizeTabs from './all-prize-tabs';
import ProposalsTab from './prize-proposals-tabs';
import ProfilePrizeSubmission from './prize-submissions';

export default function PrizeTab({ params }: { params: { id: string } }) {
  const [value, setValue] = useState('all-prizes');

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <Title className="text-lg md:text-2xl">Prize</Title>
        <Select
          value={value}
          data={[
            { label: 'Prizes', value: 'all-prizes' },
            { label: 'Proposals', value: 'all-proposals' },
            { label: 'Submissions', value: 'all-submissions' },
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
        {value === 'all-proposals' && <ProposalsTab params={params} />}
        {value === 'all-submissions' && <ProfilePrizeSubmission params={params} />}
      </div>
    </div>
  );
}
