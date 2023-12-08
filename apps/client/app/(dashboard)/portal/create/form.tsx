'use client';
import ImageComponent from '@/components/Prize/dropzone';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import {
  ActionIcon,
  Button,
  CloseButton,
  Input,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

export default function PortalForm() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [value, setValue] = useState('');
  const [richtext, setRichtext] = useState('');
  const [address, setAddress] = useState(['']);

  const onAddressChange = (index: number, funcaddress: string) => {
    setAddress((prev) => {
      prev[index] = funcaddress;
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
      const arr: string[] = JSON.parse(JSON.stringify(prev)) as string[];
      arr.splice(index, 1);
      return [...arr];
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <ImageComponent files={files} setFiles={setFiles} />
      <Input
        placeholder="Project Title"
        value={value}
        onChange={(event) => {
          setValue(event.currentTarget.value);
        }}
        radius="md"
        rightSectionPointerEvents="all"
        mt="md"
        className="focus:border-blue-600"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => {
              setValue('');
            }}
            style={{ display: value ? undefined : 'none' }}
          />
        }
      />
      <Title order={3} className="my-0">
        Tell us about your project...{' '}
      </Title>
      <Text>Aim for 200-500 words...</Text>
      <TextEditor richtext={richtext} setRichtext={setRichtext} canSetRichtext />
      <div className='grid grid-cols-3 '>
        {address.map((item, index) => (
          <div className="flex gap-3 justify-start items-center" key={item}>
            <TextInput
              type="text"
              placeholder="Enter Admin Address"
              className=""
              value={item}
              onChange={(e) => {
                onAddressChange(index, e.target.value);
              }}
            />
            {address.length > 1 && (
              <Button
                color="red"
                className="my-2"
                onClick={() => {
                  removeAddress(index);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            )}
          </div>
        ))}
      </div>
      <ActionIcon variant="filled" color="blue" size="lg" onClick={addAddress}>
        <IconPlus />
      </ActionIcon>
    </div>
  );
}
