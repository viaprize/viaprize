import { Button, Flex, Group, TagsInput, TextInput } from '@mantine/core'
import React from 'react'

export default function EditProfileModal  ()  {
  return (
    <div>
      <TextInput label="Name" data-autoFocus placeholder="Enter your name" />
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
        <Button my="md" className="w-full" variant='outline'>
            Cancel
        </Button>
        <Button my="md" className="w-full">
          Save
        </Button>
      </Flex>
    </div>
  );
}
