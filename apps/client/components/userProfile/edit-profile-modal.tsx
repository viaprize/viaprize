/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { ActionIcon, Avatar, Button, Flex, TagsInput, TextInput } from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconCameraPlus } from '@tabler/icons-react';
import { useRef, useState } from 'react';

export default function EditProfileModal() {
  const openRef = useRef<() => void>(null);
  const [profileImage, setProfileImage] = useState<FileWithPath[]>([]);

  const getProfileImage = (): string => {
    if (profileImage.length === 0) return '';
    const imageUrl = URL.createObjectURL(profileImage[0]);
    return imageUrl;
  };

  return (
    <div>
      <Dropzone
        openRef={openRef}
        activateOnClick={false}
        accept={IMAGE_MIME_TYPE}
        onDrop={setProfileImage}
      >
        <div
          className="flex mb-4 relative max-w-fit cursor-pointer"
          onClick={() => openRef.current?.()}
          style={{ pointerEvents: 'all' }}
        >
          <Avatar className="" size="xl" src={getProfileImage()}>
            A
          </Avatar>
          <ActionIcon className="absolute " style={{ bottom: '3px', right: '3px' }}>
            <IconCameraPlus size={20} />
          </ActionIcon>
        </div>
      </Dropzone>
      <TextInput label="Name" data-autoFocus placeholder="Enter your name" mt="md" />
      <TextInput label="Bio" placeholder="Enter your bio" className="my-2" />
      <TagsInput
        label="Proficiencies"
        placeholder="Pick tag from list"
        data={[
          'Programming',
          'Python',
          'JavaScript',
          'Writing',
          'Design',
          'Translation',
          'Research',
          'Real estate',
          'Apps',
          'Hardware',
          'Art',
          'Meta',
          'AI',
        ]}
      />
      <TagsInput
        label="Priorities"
        placeholder="Pick tag from list"
        data={[
          'Climate Change',
          'Network Civilizations',
          'Open-Source',
          'Community Coordination',
          'Health',
          'Education',
        ]}
        className="my-2"
      />
      <Flex gap={5}>
        <Button my="md" className="w-full" variant="outline">
          Cancel
        </Button>
        <Button my="md" className="w-full">
          Save
        </Button>
      </Flex>
    </div>
  );
}
