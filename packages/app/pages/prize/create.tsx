import { ActionIcon, Button, Checkbox, NumberInput, SimpleGrid, TextInput } from '@mantine/core';
import ImageComponent from '../../components/Prize/dropzone';
import { TextEditor } from '../../components/popupComponents/textEditor';
import React, { ReactElement, useState } from 'react';
import { IconNewSection, IconPlus } from '@tabler/icons-react';
import { JSONContent } from '@tiptap/react';
import { PrizeCreationTemplate } from '@/components/Prize/prizepage/defaultcontent';
import usePrizeProposal from '@/components/Prize/hooks/usePrizeProposal';
import { toast } from 'sonner';
import { usePrivy } from '@privy-io/react-auth';
import { FileWithPath } from '@mantine/dropzone';
import AppShellLayout from '@/components/layout/appshell';
import { useMutation } from 'wagmi';

const Prize = () => {
  const [address, setAddress] = useState(['']);
  const [title, setTitle] = useState('');
  const [richtext, setRichtext] = useState('');
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [votingTime, setVotingTime] = useState(0);
  const [proposalTime, setProposalTime] = useState(0);
  const { user } = usePrivy();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [images, setImages] = useState<string>()
  const { addProposals, uploadImages } = usePrizeProposal()
  const { mutateAsync: addProposalsMutation, isLoading: submittingProposal } = useMutation(addProposals)
  const onAddressChange = (index: number, value: string) => {
    setAddress((prev: any) => {
      prev[index] = value;
      return [...prev];
    });
  };
  const handleUploadImages = async () => {
    const newImages = await uploadImages(files)
    setImages(newImages)
  }
  const submit = async () => {
    await handleUploadImages()
    await addProposalsMutation(
      {
        admins: address,
        description: richtext,
        isAutomatic: isAutomatic,
        voting_time: votingTime,
        proposer_address: '',
        priorities: [],
        proficiencies: [],
        submission_time: proposalTime,
        images: images ? [images] : [],
        title: title

      }
    )
  }

  const handleSubmit = () => {
    console.log(user);
    try {
      console.log(images, "images")
      toast.promise(
        submit()
        ,
        {
          loading: 'Submitting Proposal',
          success: 'Proposal Submitted',
          error: 'Error Submitting Proposal',
        }
      );
    } catch {
      toast.error('Error Submitting Proposal');
    }
  };


  const useTemplateForDescription = () => {
    setRichtext(PrizeCreationTemplate);
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
    <div className="shadow-md max-w-screen-lg p-8 m-6">
      <ImageComponent
        files={files}
        setFiles={setFiles}
      />
      <TextInput
        className="my-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextEditor richtext={richtext} setRichtext={setRichtext} canSetRichtext />

      <SimpleGrid cols={2} className="my-3">
        <div className="">
          <NumberInput
            placeholder="Proposal Time (in days)"
            stepHoldDelay={500}
            stepHoldInterval={100}
            value={proposalTime}
            defaultValue={0}
            onChange={(e) => {
              setProposalTime(e || 0);
            }}
          />
          <Checkbox
            checked={isAutomatic}
            onChange={(e) => setIsAutomatic(e.currentTarget.checked)}
            className="my-2 cursor-pointer"
            label="Automatically start accepting funds after getting approval from the admin"
          />
        </div>
        <NumberInput
          placeholder="voting Time (in days)"
          stepHoldDelay={500}
          stepHoldInterval={100}
          value={votingTime}
          defaultValue={0}
          onChange={(e) => setVotingTime(e || 0)}
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
        <ActionIcon variant="filled" color="blue" size="lg" onClick={addAddress}>
          <IconPlus />
        </ActionIcon>
      </SimpleGrid>
      <Button
        className="mt-3 "
        color="dark"
        fullWidth
        loading={submittingProposal}
        onClick={handleSubmit}
      >
        Request for Approval
      </Button>
    </div>
  );
};

Prize.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};

export default Prize;
