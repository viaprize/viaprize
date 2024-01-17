/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import useAppUser from '@/components/hooks/useAppUser';
import { ActionIcon, Avatar, Button, Flex, TagsInput, TextInput } from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconCameraPlus } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from 'wagmi';
import usePortalProposal from '../hooks/usePortalProposal';
import { useUser } from '../hooks/useUser';

interface EditProfileModalProps {
  IName: string;
  IBio: string;
  IProficiencies: string[];
  IPriorities: string[];
  IAvatar: string;
  fetchUser: () => void;
  close: () => void;
}

export default function EditProfileModal({
  IName,
  IBio,
  IProficiencies,
  IPriorities,
  IAvatar,
  fetchUser,
}: EditProfileModalProps) {
  const openRef = useRef<() => void>(null);
  const { updateUser } = useUser();
  const { appUser } = useAppUser();

  const [profileImage, setProfileImage] = useState<FileWithPath[]>([]);
  const [proficiencies, setProficiencies] = useState<string[]>(IProficiencies);
  const [bio, setBio] = useState<string>(IBio);
  const [name, setName] = useState<string>(IName);
  const [priorities, setPriorities] = useState<string[]>(IPriorities);

  const { mutateAsync: updateUserProfile, isLoading: updatingProfile } =
    useMutation(updateUser);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { uploadImages } = usePortalProposal();

  const getProfileImage = (): string => {
    if (profileImage.length === 0) return '';
    const imageUrl = URL.createObjectURL(profileImage[0]);
    return imageUrl;
  };

  const handleUploadImages = async () => {
    const newImages = await uploadImages(profileImage);
    return newImages;
  };

  const handleUpdateProfile = async () => {
    try {
      const userName = appUser?.username;
      if (!userName) {
        toast.error('User name is not defined');
        return;
      }
      setUploadingImage(true);
      const profileImageAvatar = await handleUploadImages();
      setUploadingImage(false);
      await updateUserProfile({
        userName,
        name,
        priorities,
        proficiencies,
        bio,
        avatar: profileImageAvatar,
      });
      fetchUser();
    } catch (e) {
      console.log(e);
    }
  };

  const submit = () => {
    toast.promise(handleUpdateProfile(), {
      loading: 'Updating profile',
      success: 'Profile updated',
      error: 'Error updating profile',
    });
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
          <Avatar className="" size="xl" src={getProfileImage() || IAvatar}>
            A
          </Avatar>
          <ActionIcon className="absolute " style={{ bottom: '3px', right: '3px' }}>
            <IconCameraPlus size={20} />
          </ActionIcon>
        </div>
      </Dropzone>
      <TextInput
        label="Name"
        data-autoFocus
        placeholder="Whizzy"
        mt="md"
        value={name}
        defaultValue={IName}
        onChange={(e) => {
          setName(e.currentTarget.value);
        }}
      />
      <TextInput
        label="Bio"
        placeholder="Enter your bio"
        className="my-2"
        value={bio}
        defaultValue={IBio}
        onChange={(e) => {
          setBio(e.currentTarget.value);
        }}
      />
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
        defaultValue={IProficiencies}
        value={proficiencies}
        onChange={setProficiencies}
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
        value={priorities}
        onChange={setPriorities}
        defaultValue={IPriorities}
      />
      <Flex gap={5}>
        <Button
          my="md"
          className="w-full"
          variant="outline"
          disabled={updatingProfile || uploadingImage}
        >
          Cancel
        </Button>
        <Button
          disabled={updatingProfile || uploadingImage}
          my="md"
          className="w-full"
          onClick={submit}
        >
          Save
        </Button>
      </Flex>
    </div>
  );
}
