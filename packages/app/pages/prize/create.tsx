import { ActionIcon, Button, Checkbox, NumberInput, SimpleGrid, TextInput } from '@mantine/core';
import ImageComponent from '../../components/Prize/dropzone';
import { TextEditor } from '../../components/popupComponents/textEditor';
import React, { useState } from 'react';
import { IconNewSection, IconPlus } from '@tabler/icons-react';


const Prize = () => {
  const [address, setAddress] = useState(['']);
  const onAddressChange = (index: number, value: string) => {
    setAddress((prev: any) => {
      prev[index] = value;
      return [...prev];
    });
  };

  const addAddress = () => {
    setAddress((prev: string[]) => {
      return [...prev, ''];
    });
  };

  const removeAddress = (index: number) => {
    setAddress((prev) => {
      const arr = JSON.parse(JSON.stringify(prev));
      arr.splice(index, 1);
      return [...arr];
    });
  };
  return (
  
    <div className="w-full grid place-content-center my-3">
      <div className="shadow-md max-w-screen-lg p-8 m-6">
        <ImageComponent />
        <TextInput className="my-2" placeholder="Name" />
        <TextEditor />
        <SimpleGrid cols={2} className="my-3">
            <div className="">
          <NumberInput
            placeholder="Proposal Time (in days)"
            stepHoldDelay={500}
            stepHoldInterval={100}
          />
          <Checkbox className='my-2' label="Automatically start accepting funds after getting approval from the admin" />
          </div>
          <NumberInput
            placeholder="voting Time (in days)"
            stepHoldDelay={500}
            stepHoldInterval={100}
          />
          

          {address.map((item, index) => (
            <div className="" key={index}>
              <TextInput
                type="text"
                placeholder="Address"
                className=""
                value={item}
                onChange={(e) => onAddressChange(index, e.target.value)}
              />
              {address.length > 1 && (
                <Button color="red" className="my-2" onClick={() => removeAddress(index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )}
            </div>
          ))}
          <ActionIcon variant="filled" color="blue" onClick={addAddress}>
            <IconPlus />
          </ActionIcon>
        </SimpleGrid>
        <Button className="mt-3 " color="dark" fullWidth>
          Request for Approval
        </Button>
      </div>
    </div>
   
  );
};

export default Prize;
