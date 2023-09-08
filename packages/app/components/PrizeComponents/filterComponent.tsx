import { useState } from 'react';
import { MultiSelect } from '@mantine/core';

const Filter = () => {
  const [data, setData] = useState([
    { value: '1', label: 'Proficiens' },
    { value: '2', label: 'Priorities' },
  ]);

  return (
    <MultiSelect
      label="Select Which Suits to your Project"
      data={data}
      placeholder="Select items"
      searchable
      creatable
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        const item = { value: query, label: query };
        setData((current) => [...current, item]);
        return item;
      }}
    />
  );
}

export default Filter